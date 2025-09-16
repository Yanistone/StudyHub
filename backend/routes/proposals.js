const router = require("express").Router();
const { body } = require("express-validator");
const ctrl = require("../controllers/proposalController");
const requireAuth = require("../middleware/requireAuth");
const requireRole = require("../middleware/requireRole");

router.post(
  "/",
  requireAuth,
  body("type").isString(),
  body("payloadJson").exists(),
  ctrl.create
);

// Mod/Admin : lister et reviewer
router.get("/", requireAuth, requireRole("MOD", "ADMIN"), ctrl.list);
router.post(
  "/:id/review",
  requireAuth,
  requireRole("MOD", "ADMIN"),
  ctrl.review
);

module.exports = router;
