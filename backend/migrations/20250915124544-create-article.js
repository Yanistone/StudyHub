"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Articles", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: { type: Sequelize.STRING, allowNull: false },
      slug: { type: Sequelize.STRING, allowNull: false, unique: true },
      summary: { type: Sequelize.TEXT, allowNull: true },
      content: { type: Sequelize.TEXT, allowNull: true },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "PUBLISHED",
      },
      views: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      authorId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: "Users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      categoryId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: "Categories", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });

    await queryInterface.addIndex("Articles", ["title"]);
    await queryInterface.addIndex("Articles", ["categoryId"]);
    await queryInterface.addIndex("Articles", ["slug"], { unique: true });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("Articles");
  },
};
