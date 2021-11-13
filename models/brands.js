"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class brands extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      brands.hasMany(models.links, {
        as: "myLinks",
        foreignKey: {
          name: "brand_id",
        },
      });

      brands.belongsTo(models.users, {
        as: "user",
        foreignKey: {
          name: "user_id",
        },
      });
    }
  }
  brands.init(
    {
      brandName: DataTypes.STRING,
      brandImage: DataTypes.STRING,
      description: DataTypes.STRING,
      brandUrl: DataTypes.STRING,
      user_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "brands",
    }
  );
  return brands;
};
