const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const CartItem = sequelize.define("CartItem", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  quantity: DataTypes.INTEGER,
}, {
  tableName: "cartItem",
  timestamps: false,
});

module.exports = CartItem;