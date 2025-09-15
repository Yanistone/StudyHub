"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Article, { foreignKey: "authorId" });
      User.hasMany(models.Comment, { foreignKey: "authorId" });
      User.hasMany(models.Proposal, { foreignKey: "submittedBy" });
      User.hasMany(models.Proposal, {
        foreignKey: "reviewerId",
        as: "Reviews",
      });
    }
  }
  User.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      passwordHash: { type: DataTypes.STRING, allowNull: false },
      role: { type: DataTypes.STRING, allowNull: false, defaultValue: "USER" },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    { sequelize, modelName: "User" }
  );
  return User;
};
