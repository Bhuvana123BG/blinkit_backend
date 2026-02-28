const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Subcategory = sequelize.define("Subcategory", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: DataTypes.STRING,
  imgurl: DataTypes.STRING,
}, {
  tableName: "subcategory",
  timestamps: false,
});

module.exports = Subcategory;