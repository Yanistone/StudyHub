const { Proposal, Article, User, sequelize } = require("../models");

exports.create = async (req, res, next) => {
  try {
    const { type, targetArticleId, payloadJson } = req.body || {};
    if (!type || !payloadJson)
      return res.status(400).json({ error: "type & payloadJson required" });
    if (!["NEW", "EDIT"].includes(type))
      return res.status(400).json({ error: "type invalid" });
    if (type === "EDIT" && !targetArticleId)
      return res
        .status(400)
        .json({ error: "targetArticleId required for EDIT" });

    const prop = await Proposal.create({
      type,
      targetArticleId: type === "EDIT" ? targetArticleId : null,
      submittedBy: req.user.id,
      payloadJson:
        typeof payloadJson === "string"
          ? payloadJson
          : JSON.stringify(payloadJson),
      status: "PENDING",
    });

    res.status(201).json(prop);
  } catch (e) {
    next(e);
  }
};

exports.list = async (req, res, next) => {
  try {
    const { status = "PENDING" } = req.query || {};
    const items = await Proposal.findAll({
      where: { status },
      include: [
        { model: User, as: "submitter", attributes: ["id", "email"] },
        { model: User, as: "reviewer", attributes: ["id", "email"] },
        { model: Article, attributes: ["id", "title", "slug"] },
      ],
      order: [["createdAt", "ASC"]],
    });
    res.json(items);
  } catch (e) {
    next(e);
  }
};

exports.review = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { decision, reviewComment } = req.body || {};
    if (!["APPROVED", "REJECTED"].includes(decision)) {
      return res
        .status(400)
        .json({ error: "decision must be APPROVED or REJECTED" });
    }

    const prop = await Proposal.findByPk(id, { transaction: t });
    if (!prop || prop.status !== "PENDING") {
      await t.rollback();
      return res
        .status(404)
        .json({ error: "Proposal not found or already reviewed" });
    }

    prop.status = decision;
    prop.reviewerId = req.user.id;
    prop.reviewComment = reviewComment || null;
    prop.decidedAt = new Date();
    await prop.save({ transaction: t });

    // Application si APPROVED
    if (decision === "APPROVED") {
      const payload = JSON.parse(prop.payloadJson);
      if (prop.type === "NEW") {
        // créer un nouvel Article (status PUBLISHED par défaut)
        const { Article } = require("../models");
        const slugify = require("../utils/slugify");
        const slug = slugify(payload.title || "nouvel-article");
        const created = await Article.create(
          {
            title: payload.title,
            summary: payload.summary || null,
            content: payload.content || null,
            categoryId: payload.categoryId || null,
            authorId: prop.submittedBy,
            slug,
            status: "PUBLISHED",
          },
          { transaction: t }
        );
        prop.targetArticleId = created.id;
        await prop.save({ transaction: t });
      } else if (prop.type === "EDIT") {
        const { Article } = require("../models");
        const art = await Article.findByPk(prop.targetArticleId, {
          transaction: t,
        });
        if (!art) {
          await t.rollback();
          return res.status(404).json({ error: "Target article not found" });
        }
        // Met à jour uniquement les champs présents
        ["title", "summary", "content", "categoryId"].forEach((k) => {
          if (payload[k] !== undefined) art[k] = payload[k];
        });
        await art.save({ transaction: t });
      }
    }

    await t.commit();
    res.json(prop);
  } catch (e) {
    await t.rollback();
    next(e);
  }
};
