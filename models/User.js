const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: DataTypes.STRING,
  email: DataTypes.STRING,
  phonenumber: DataTypes.STRING(20),
  password: DataTypes.STRING,
}, {
  tableName: "users",
  timestamps: false,
});

module.exports = User;

