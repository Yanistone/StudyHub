const { User } = require("../models");

// Récupérer tous les utilisateurs
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "email", "username", "role", "isActive", "createdAt"],
      order: [["id", "ASC"]],
    });
    res.json(users);
  } catch (e) {
    next(e);
  }
};

// Mettre à jour le rôle d'un utilisateur
exports.updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!["USER", "MOD", "ADMIN"].includes(role)) {
      return res.status(400).json({ error: "Rôle invalide" });
    }

    // Vérifier si c'est le dernier admin
    if (role !== "ADMIN") {
      const adminCount = await User.count({ where: { role: "ADMIN" } });
      const user = await User.findByPk(id);

      if (adminCount <= 1 && user.role === "ADMIN") {
        return res.status(400).json({
          error: "Impossible de modifier le rôle du dernier administrateur",
        });
      }
    }

    const [updated] = await User.update({ role }, { where: { id } });

    if (!updated) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    res.json({ message: "Rôle mis à jour avec succès" });
  } catch (e) {
    next(e);
  }
};

// Activer/désactiver un utilisateur
exports.updateUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    // Vérifier si c'est le dernier admin actif
    if (isActive === false) {
      const user = await User.findByPk(id);

      if (user.role === "ADMIN") {
        const activeAdminCount = await User.count({
          where: { role: "ADMIN", isActive: true },
        });

        if (activeAdminCount <= 1) {
          return res.status(400).json({
            error: "Impossible de désactiver le dernier administrateur actif",
          });
        }
      }
    }

    const [updated] = await User.update({ isActive }, { where: { id } });

    if (!updated) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    res.json({
      message: isActive
        ? "Utilisateur activé avec succès"
        : "Utilisateur désactivé avec succès",
    });
  } catch (e) {
    next(e);
  }
};
