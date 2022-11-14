const sequelize = require("../../db");
const { DataTypes } = require("sequelize");
const { User } = require("../models");
const { Market } = require("./tableMarket");

const OrderPurchase = sequelize.define("order-purchase", {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    price: { type: DataTypes.DOUBLE, allowNull: false },
    count: { type: DataTypes.DOUBLE, allowNull: false },
  });

  User.hasMany(OrderPurchase, { as: "order_purchase" });
  OrderPurchase.belongsTo(User, { as: "user" });

  Market.hasMany(OrderPurchase, { as: "order_purchase" });
  OrderPurchase.belongsTo(Market, { as: "market" });


  module.exports = {
    OrderPurchase
  }