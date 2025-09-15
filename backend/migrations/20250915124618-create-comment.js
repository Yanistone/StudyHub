"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Comments", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      articleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Articles", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      authorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      content: { type: Sequelize.TEXT, allowNull: false },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "PUBLISHED",
      }, // PUBLISHED|HIDDEN|DELETED
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });

    await queryInterface.addIndex("Comments", ["articleId"]);
    await queryInterface.addIndex("Comments", ["status"]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("Comments");
  },
};
