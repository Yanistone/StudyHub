"use strict";
const bcrypt = require("bcrypt");

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const passwordHash = await bcrypt.hash("password123", 10);

    await queryInterface.bulkInsert("Users", [
      {
        email: "user@user.com",
        passwordHash,
        username: "User",
        role: "USER",
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Users", { email: "user@user.com" }, {});
  },
};
