const {
  Article,
  User,
  Category,
  Tag,
  ArticleTag,
  Sequelize,
} = require("../models");
const slugify = require("../utils/slugify");
const { Op } = Sequelize;

exports.list = async (req, res, next) => {
  try {
    const { q, categoryId, tag } = req.query || {};
    const where = {};
    if (q) where.title = { [Op.like]: `%${q}%` };
    if (categoryId) where.categoryId = categoryId;

    const include = [
      { model: User, as: "author", attributes: ["id", "username"] },
      { model: Category, attributes: ["id", "name", "slug"] },
      {
        model: Tag,
        through: { attributes: [] },
        attributes: ["id", "name", "slug"],
      },
    ];

    // Filtre par tag (slug ou id)
    if (tag) {
      include.push({
        model: Tag,
        through: { attributes: [] },
        where: { [Op.or]: [{ slug: tag }, { id: +tag || 0 }] },
        required: true,
      });
    }

    const items = await Article.findAll({
      where,
      include,
      order: [["createdAt", "DESC"]],
    });
    res.json(items);
  } catch (e) {
    next(e);
  }
};

exports.bySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const art = await Article.findOne({
      where: { slug },
      include: [
        { model: User, as: "author", attributes: ["id", "username"] },
        { model: Category, attributes: ["id", "name", "slug"] },
        {
          model: Tag,
          through: { attributes: [] },
          attributes: ["id", "name", "slug"],
        },
      ],
    });
    if (!art) return res.status(404).json({ error: "Not found" });
    res.json(art);
  } catch (e) {
    next(e);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { title, summary, content, categoryId, tagIds = [] } = req.body || {};
    if (!title) return res.status(400).json({ error: "title required" });

    const slug = slugify(title);
    const exists = await Article.findOne({ where: { slug } });
    if (exists)
      return res.status(409).json({ error: "Article with same slug exists" });

    const art = await Article.create({
      title,
      summary,
      content,
      categoryId,
      status: "PUBLISHED",
      slug,
      authorId: req.user.id,
    });

    if (Array.isArray(tagIds) && tagIds.length) {
      const rows = tagIds.map((tid) => ({ articleId: art.id, tagId: tid }));
      await ArticleTag.bulkCreate(rows, { ignoreDuplicates: true });
    }

    const withIncludes = await Article.findByPk(art.id, {
      include: [
        { model: Category, attributes: ["id", "name", "slug"] },
        {
          model: Tag,
          through: { attributes: [] },
          attributes: ["id", "name", "slug"],
        },
      ],
    });

    res.status(201).json(withIncludes);
  } catch (e) {
    next(e);
  }
};
