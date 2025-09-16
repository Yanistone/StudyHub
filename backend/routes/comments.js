const router = require("express").Router();
const { body } = require("express-validator");
const ctrl = require("../controllers/commentController");
const requireAuth = require("../middleware/requireAuth");
const requireRole = require("../middleware/requireRole");

// Liste des commentaires d’un article
router.get("/article/:articleId", ctrl.listByArticle);

// Créer un commentaire (auth requis)
router.post(
  "/article/:articleId",
  requireAuth,
  body("content").isLength({ min: 1 }),
  ctrl.create
);

// Modération (MOD/ADMIN)
router.patch(
  "/:id",
  requireAuth,
  requireRole("MOD", "ADMIN"),
  body("status").isString(),
  ctrl.moderate
);

module.exports = router;
