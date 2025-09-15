"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Article extends Model {
    static associate(models) {
      Article.belongsTo(models.User, { foreignKey: "authorId", as: "author" });
      Article.belongsTo(models.Category, { foreignKey: "categoryId" });
      Article.hasMany(models.Comment, { foreignKey: "articleId" });
      Article.belongsToMany(models.Tag, {
        through: models.ArticleTag,
        foreignKey: "articleId",
      });
      Article.hasMany(models.Proposal, { foreignKey: "targetArticleId" });
    }
  }
  Article.init(
    {
      title: { type: DataTypes.STRING, allowNull: false },
      slug: { type: DataTypes.STRING, allowNull: false, unique: true },
      summary: { type: DataTypes.TEXT, allowNull: true },
      content: { type: DataTypes.TEXT, allowNull: true },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "PUBLISHED",
      },
      views: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    },
    { sequelize, modelName: "Article" }
  );
  return Article;
};
