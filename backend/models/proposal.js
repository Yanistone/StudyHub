"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Proposal extends Model {
    static associate(models) {
      Proposal.belongsTo(models.Article, { foreignKey: "targetArticleId" });
      Proposal.belongsTo(models.User, {
        foreignKey: "submittedBy",
        as: "submitter",
      });
      Proposal.belongsTo(models.User, {
        foreignKey: "reviewerId",
        as: "reviewer",
      });
    }
  }
  Proposal.init(
    {
      type: { type: DataTypes.STRING, allowNull: false }, // 'NEW' | 'EDIT'
      targetArticleId: { type: DataTypes.INTEGER, allowNull: true },
      submittedBy: { type: DataTypes.INTEGER, allowNull: false },
      // LONGTEXT côté MySQL si volumineux; TEXT suffit le plus souvent
      payloadJson: { type: DataTypes.TEXT("long"), allowNull: false },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "PENDING",
      }, // PENDING|APPROVED|REJECTED
      reviewerId: { type: DataTypes.INTEGER, allowNull: true },
      reviewComment: { type: DataTypes.TEXT, allowNull: true },
      decidedAt: { type: DataTypes.DATE, allowNull: true },
    },
    { sequelize, modelName: "Proposal" }
  );
  return Proposal;
};
