const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Address = sequelize.define("Address", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  latitude: DataTypes.FLOAT,
  longitude: DataTypes.FLOAT,
  addressline1: DataTypes.STRING,
  addressline2: DataTypes.STRING,
  phonenumber: DataTypes.STRING(20),
}, {
  tableName: "address",
  timestamps: false,
});

module.exports = Address;