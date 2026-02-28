const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Product = sequelize.define("Product", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: DataTypes.STRING,
  description: DataTypes.TEXT,
  imgurl: DataTypes.STRING,
  maxorderlimit: DataTypes.INTEGER,
  price: DataTypes.FLOAT,
  discount: DataTypes.FLOAT,
  isavailable: DataTypes.BOOLEAN,
  ingredients: DataTypes.TEXT,
  packagingtype: DataTypes.STRING,
  keyfeatures: DataTypes.TEXT,
  metadata: DataTypes.JSON,
}, {
  tableName: "product",
  timestamps: false,
});

module.exports = Product;