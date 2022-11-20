const sequelize = require("../../db");
const { DataTypes } = require("sequelize");
const { User } = require("../models");
const { Market } = require("./tableMarket");

const OrderSell = sequelize.define("order-sell", {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    price: { type: DataTypes.DOUBLE, allowNull: false },
    amount: { type: DataTypes.DOUBLE, allowNull: false },
    summ: { type: DataTypes.DOUBLE, allowNull: false },
  });

  User.hasMany(OrderSell, { as: "order_sell" });
  OrderSell.belongsTo(User, { as: "user" }); 

  Market.hasMany(OrderSell, { as: "order_sell" });
  OrderSell.belongsTo(Market, { as: "market" });


  module.exports = {
    OrderSell
  }