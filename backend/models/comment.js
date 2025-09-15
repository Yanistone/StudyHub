"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {
      Comment.belongsTo(models.Article, { foreignKey: "articleId" });
      Comment.belongsTo(models.User, { foreignKey: "authorId", as: "author" });
    }
  }
  Comment.init(
    {
      articleId: { type: DataTypes.INTEGER, allowNull: false },
      authorId: { type: DataTypes.INTEGER, allowNull: false },
      content: { type: DataTypes.TEXT, allowNull: false },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "PUBLISHED",
      }, // PUBLISHED|HIDDEN|DELETED
    },
    { sequelize, modelName: "Comment" }
  );
  return Comment;
};
