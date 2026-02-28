const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const OrderItem = sequelize.define("OrderItem", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  quantity: DataTypes.INTEGER,
  amountpaid: DataTypes.FLOAT,
  discount: DataTypes.FLOAT,
}, {
  tableName: "orderItem",
  timestamps: false,
});

module.exports = OrderItem;