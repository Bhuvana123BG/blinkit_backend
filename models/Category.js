const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Category = sequelize.define("Category", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: DataTypes.STRING,
  imgurl: DataTypes.STRING,
}, {
  tableName: "category",
  timestamps: false,
});

module.exports = Category;