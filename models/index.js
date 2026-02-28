const sequelize = require("../config/database");

const User = require("./User");
const Address = require("./Address");
const Category = require("./Category");
const Subcategory = require("./Subcategory");
const Product = require("./Product");
const Order = require("./Order");
const OrderItem = require("./OrderItem");
const CartItem = require("./CartItem");

// Associations

User.hasMany(Address, { foreignKey: "user_id" });
Address.belongsTo(User, { foreignKey: "user_id" });

Category.hasMany(Subcategory, { foreignKey: "category_id" });
Subcategory.belongsTo(Category, { foreignKey: "category_id" });

Subcategory.hasMany(Product, { foreignKey: "subcategory_id" });
Product.belongsTo(Subcategory, { foreignKey: "subcategory_id" });

User.hasMany(Order, { foreignKey: "user_id" });
Order.belongsTo(User, { foreignKey: "user_id" });

Address.hasMany(Order, { foreignKey: "address_id" });
Order.belongsTo(Address, { foreignKey: "address_id" });

Order.hasMany(OrderItem, { foreignKey: "order_id" });
OrderItem.belongsTo(Order, { foreignKey: "order_id" });

Product.hasMany(OrderItem, { foreignKey: "product_id" });
OrderItem.belongsTo(Product, { foreignKey: "product_id" });

User.hasMany(CartItem, { foreignKey: "user_id" });
CartItem.belongsTo(User, { foreignKey: "user_id" });

Product.hasMany(CartItem, { foreignKey: "product_id" });
CartItem.belongsTo(Product, { foreignKey: "product_id" });

module.exports = {
  sequelize,
  User,
  Address,
  Category,
  Subcategory,
  Product,
  Order,
  OrderItem,
  CartItem,
};