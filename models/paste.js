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
      // define association here
    }
  }
  Paste.init(
    {
      pasteId: DataTypes.STRING,
      title: DataTypes.STRING,
      content: DataTypes.STRING(10000),
      author: DataTypes.STRING,
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
