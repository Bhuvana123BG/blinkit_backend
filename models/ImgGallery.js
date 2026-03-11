const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ImgGallery = sequelize.define(
  "ImgGallery",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    imgurl: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    prodId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "ImgGallery",
    timestamps: false,
  }
);

module.exports = ImgGallery;