const sequelize = require("../../db");
const { DataTypes } = require("sequelize");
const { User } = require("../models");
const { Market } = require("./tableMarket");

const OrderSale = sequelize.define("order-sale", {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    price: { type: DataTypes.DECIMAL(61,8), allowNull: false },
    amount: { type: DataTypes.DECIMAL(61,8), allowNull: false },
    sumWithOutCom: { type: DataTypes.DECIMAL(61,8), allowNull: false },
    summ: { type: DataTypes.DECIMAL(61,8), allowNull: false },
  });

  User.hasMany(OrderSale, { as: "order_sale" });
  OrderSale.belongsTo(User, { as: "user" });

  Market.hasMany(OrderSale, { as: "order_sale" });
  OrderSale.belongsTo(Market, { as: "market" });


  module.exports = {
    OrderSale
  }