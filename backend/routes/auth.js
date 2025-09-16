const router = require("express").Router();
const { body } = require("express-validator");
const ctrl = require("../controllers/authController");
const requireAuth = require("../middleware/requireAuth");

router.post(
  "/register",
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  ctrl.register
);

router.post(
  "/login",
  body("email").isEmail(),
  body("password").isLength({ min: 1 }),
  ctrl.login
);

router.get("/me", requireAuth, ctrl.me);

module.exports = router;
