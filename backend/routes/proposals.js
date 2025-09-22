const router = require("express").Router();
const { body } = require("express-validator");
const ctrl = require("../controllers/proposalController");
const requireAuth = require("../middleware/requireAuth");
const requireRole = require("../middleware/requireRole");

// Route pour qu'un utilisateur puisse voir ses propres propositions
router.get("/my", requireAuth, async (req, res, next) => {
  try {
    const { Proposal, Article } = require("../models");
    const items = await Proposal.findAll({
      where: { submittedBy: req.user.id },
      include: [{ model: Article, attributes: ["id", "title", "slug"] }],
      order: [["createdAt", "DESC"]],
    });
    res.json(items);
  } catch (e) {
    next(e);
  }
});

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
