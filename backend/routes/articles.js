const router = require("express").Router();
const { body } = require("express-validator");
const ctrl = require("../controllers/articleController");
const requireAuth = require("../middleware/requireAuth");
const requireRole = require("../middleware/requireRole");

// Public
router.get("/", ctrl.list);
router.get("/:slug", ctrl.bySlug);

// Création (MOD/ADMIN)
router.post(
  "/",
  requireAuth,
  requireRole("MOD", "ADMIN"),
  body("title").isLength({ min: 3 }),
  ctrl.create
);

module.exports = router;
