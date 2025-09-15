"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Proposals", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      type: { type: Sequelize.STRING, allowNull: false }, // NEW | EDIT
      targetArticleId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: "Articles", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      submittedBy: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      payloadJson: { type: Sequelize.TEXT("long"), allowNull: false },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "PENDING",
      }, // PENDING|APPROVED|REJECTED
      reviewerId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: "Users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      reviewComment: { type: Sequelize.TEXT, allowNull: true },
      decidedAt: { type: Sequelize.DATE, allowNull: true },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });

    await queryInterface.addIndex("Proposals", ["status"]);
    await queryInterface.addIndex("Proposals", ["type"]);
    await queryInterface.addIndex("Proposals", ["submittedBy"]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("Proposals");
  },
};
