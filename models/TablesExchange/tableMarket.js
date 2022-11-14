const sequelize = require("../../db");
const { DataTypes } = require("sequelize");

const Market = sequelize.define("market", {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      allowNull: false,
    },
    pair: { type: DataTypes.STRING, allowNull: false },
    last: { type: DataTypes.STRING, defaultValue: null },
    lowestAsk: { type: DataTypes.DOUBLE, defaultValue: null },
    highestBid: { type: DataTypes.DOUBLE, defaultValue: null },
    percentChange: { type: DataTypes.FLOAT, defaultValue: null },
    baseVolume: { type: DataTypes.DOUBLE, defaultValue: null },
    quoteVolume: { type: DataTypes.DOUBLE, defaultValue: null },
    isFrozen: { type: DataTypes.DOUBLE, defaultValue: null },
    postOnly: { type: DataTypes.DOUBLE, defaultValue: null },
    high24hr: { type: DataTypes.DOUBLE, defaultValue: null },
    low24hr: { type: DataTypes.DOUBLE, defaultValue: null },
  });


  
  module.exports = {
    Market
  }