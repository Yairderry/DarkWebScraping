"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PasteLabel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PasteLabel.init(
    {
      pasteId: DataTypes.NUMBER,
      label: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "PasteLabel",
      tableName: "PasteLabels",
      underscored: true,
    }
  );
  return PasteLabel;
};
