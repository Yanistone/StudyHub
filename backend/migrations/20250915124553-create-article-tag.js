"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ArticleTags", {
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
      tagId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Tags", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });

    await queryInterface.addIndex("ArticleTags", ["articleId"]);
    await queryInterface.addIndex("ArticleTags", ["tagId"]);
    await queryInterface.addConstraint("ArticleTags", {
      fields: ["articleId", "tagId"],
      type: "unique",
      name: "uniq_article_tag",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("ArticleTags");
  },
};
