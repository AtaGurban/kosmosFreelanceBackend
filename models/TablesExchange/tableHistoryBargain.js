const sequelize = require("../../db");
const { DataTypes } = require("sequelize");
const { User } = require("../models");
const { OrderPurchase } = require("./tableOrdesPurchase");
const { OrderSale } = require("./tableOrderSale");


const HistoryBargain = sequelize.define("history-bargain", {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    globalTradeID: { type: DataTypes.BIGINT, defaultValue:null },
    tradeID: { type: DataTypes.BIGINT,defaultValue:null  },
    date: { type: DataTypes.DATE, defaultValue:null },
    type: { type: DataTypes.STRING, defaultValue:null },
    rate: { type: DataTypes.DOUBLE, defaultValue:null },
    amount: { type: DataTypes.DOUBLE, defaultValue:null },
    total: { type: DataTypes.DOUBLE, defaultValue:null },
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