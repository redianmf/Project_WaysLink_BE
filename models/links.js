"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class links extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      links.belongsTo(models.brands, {
        as: "links",
        foreignKey: {
          name: "brand_id",
        },
      });
    }
  }
  links.init(
    {
      titleLink: DataTypes.STRING,
      titleUrl: DataTypes.STRING,
      clickCount: DataTypes.INTEGER,
      brand_id: DataTypes.INTEGER,
      linkImage: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "links",
    }
  );
  return links;
};
