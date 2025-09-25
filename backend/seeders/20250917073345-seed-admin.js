"use strict";
const bcrypt = require("bcrypt");

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const passwordHash = await bcrypt.hash("password123", 10);

    await queryInterface.bulkInsert("Users", [
      {
        email: "admin@admin.com",
        passwordHash,
        username: "Admin",
        role: "ADMIN",
        isActive: true,
        points: 0,
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Users", { email: "admin@admin.com" }, {});
  },
};
