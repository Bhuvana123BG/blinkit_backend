const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const CartItem = sequelize.define("CartItem", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  quantity: DataTypes.INTEGER,
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

}, {
  tableName: "cartItem",
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ["user_id", "product_id"],
    },
  ],
});

module.exports = CartItem;