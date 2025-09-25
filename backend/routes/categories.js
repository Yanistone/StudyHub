const router = require("express").Router();
const { Category } = require("../models");

// Route pour récupérer toutes les catégories
router.get("/", async (req, res, next) => {
  try {
    const categories = await Category.findAll({
      attributes: ["id", "name", "slug", "description"],
      order: [["name", "ASC"]],
    });
    res.json(categories);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
