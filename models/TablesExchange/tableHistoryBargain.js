const sequelize = require("../../db");
const { DataTypes } = require("sequelize");
const { User } = require("../models");
const { OrderSale } = require("./tableOrderSale");
const { OrderSell } = require("./tableOrdesSell");


const HistoryBargain = sequelize.define("history-bargain", {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    globalTradeID: { type: DataTypes.BIGINT, defaultValue:null },
    tradeID: { type: DataTypes.BIGINT,defaultValue:null  },
    date: { type: DataTypes.DATE, defaultValue:null },
    type: { type: DataTypes.STRING, defaultValue:null },
    rate: { type: DataTypes.DOUBLE, defaultValue:null },
    amount: { type: DataTypes.DOUBLE, defaultValue:null },
    price: { type: DataTypes.DOUBLE, defaultValue:null },
    total: { type: DataTypes.DOUBLE, defaultValue:null },
    totalWithCom: { type: DataTypes.DOUBLE, defaultValue:null },
  });

  User.hasMany(HistoryBargain, { as: "history-bargain" });
  HistoryBargain.belongsTo(User, { as: "user" });

  // OrderSell.hasMany(HistoryBargain, { as: "history-bargain" });
  // HistoryBargain.belongsTo(OrderSell, { as: "order-sell" });

  // OrderSale.hasMany(HistoryBargain, { as: "history-bargain" });
  // HistoryBargain.belongsTo(OrderSale, { as: "order-sale" });




  module.exports = {
    HistoryBargain
  }