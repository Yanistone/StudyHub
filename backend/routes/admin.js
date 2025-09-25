const router = require("express").Router();
const adminCtrl = require("../controllers/adminController");
const requireAuth = require("../middleware/requireAuth");
const requireRole = require("../middleware/requireRole");

// Toutes les routes nécessitent une authentification et le rôle ADMIN
router.use(requireAuth, requireRole("ADMIN"));

// Routes pour la gestion des utilisateurs
router.get("/users", adminCtrl.getUsers);
router.put("/users/:id/role", adminCtrl.updateUserRole);
router.put("/users/:id/status", adminCtrl.updateUserStatus);

module.exports = router;
