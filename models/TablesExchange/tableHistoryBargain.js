const sequelize = require("../../db");
const { DataTypes } = require("sequelize");
const { User } = require("../models");
const { OrderPurchase } = require("./tableOrdesPurchase");
const { OrderSale } = require("./tableOrderSale");


const HistoryBargain = sequelize.define("history-bargain", {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  });

  User.hasMany(HistoryBargain, { as: "history-bargain" });
  HistoryBargain.belongsTo(User, { as: "user" });

  OrderPurchase.hasMany(HistoryBargain, { as: "order-purchase" });
  HistoryBargain.belongsTo(OrderPurchase, { as: "user" });

  OrderSale.hasMany(HistoryBargain, { as: "order-sale" });
  HistoryBargain.belongsTo(OrderSale, { as: "user" });




  module.exports = {
    HistoryBargain
  }