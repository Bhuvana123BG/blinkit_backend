const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Order = sequelize.define("Order", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  totalamountpaid: DataTypes.FLOAT,
  amountsaved: DataTypes.FLOAT,
  orderedlatitude: DataTypes.FLOAT,
  orderedlongitude: DataTypes.FLOAT,
  phonenumber: DataTypes.STRING(20),
  deliverystatus: {
    type: DataTypes.ENUM("pending", "shipped", "delivered", "cancelled"),
  },
}, {
  tableName: "order",
  timestamps: false,
});

module.exports = Order;