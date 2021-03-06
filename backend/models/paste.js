"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Paste extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.PasteLabel, { foreignKey: "pasteId" });
    }
  }
  Paste.init(
    {
      pasteId: DataTypes.STRING,
      title: DataTypes.STRING,
      content: DataTypes.TEXT("long"),
      author: DataTypes.STRING,
      site: DataTypes.STRING,
      date: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Paste",
      tableName: "Pastes",
      underscored: true,
    }
  );
  return Paste;
};
