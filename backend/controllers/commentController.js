const { Comment, Article, User } = require("../models");

exports.listByArticle = async (req, res, next) => {
  try {
    const { articleId } = req.params;
    const items = await Comment.findAll({
      where: { articleId },
      include: [{ model: User, as: "author", attributes: ["id", "email"] }],
      order: [["createdAt", "ASC"]],
    });
    res.json(items);
  } catch (e) {
    next(e);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { articleId } = req.params;
    const { content } = req.body || {};
    if (!content) return res.status(400).json({ error: "content required" });

    const art = await Article.findByPk(articleId);
    if (!art) return res.status(404).json({ error: "Article not found" });

    const comment = await Comment.create({
      articleId: art.id,
      authorId: req.user.id,
      content,
      status: "PUBLISHED",
    });
    res.status(201).json(comment);
  } catch (e) {
    next(e);
  }
};

exports.moderate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body || {}; // PUBLISHED|HIDDEN|DELETED
    if (!["PUBLISHED", "HIDDEN", "DELETED"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }
    const comment = await Comment.findByPk(id);
    if (!comment) return res.status(404).json({ error: "Not found" });
    comment.status = status;
    await comment.save();
    res.json(comment);
  } catch (e) {
    next(e);
  }
};
