"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ArticleTag extends Model {
    static associate(models) {
      // handled by belongsToMany on Article and Tag
    }
  }
  ArticleTag.init(
    {
      articleId: { type: DataTypes.INTEGER, allowNull: false },
      tagId: { type: DataTypes.INTEGER, allowNull: false },
    },
    { sequelize, modelName: "ArticleTag" }
  );
  return ArticleTag;
};
