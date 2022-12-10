const sequelize = require("../../db");
const { DataTypes } = require("sequelize");

const Market = sequelize.define("market", {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      // allowNull: false,
      autoIncrement: true 
    },
    pair: { type: DataTypes.STRING, allowNull: false },
    last: { type: DataTypes.DECIMAL(61,8), defaultValue: null },
    lowestAsk: { type: DataTypes.DECIMAL(61,8), defaultValue: null },
    highestBid: { type: DataTypes.DECIMAL(61,8), defaultValue: null },
    percentChange: { type: DataTypes.FLOAT, defaultValue: null },
    baseVolume: { type: DataTypes.DECIMAL(61,8), defaultValue: null },
    quoteVolume: { type: DataTypes.DECIMAL(61,8), defaultValue: null },
    isFrozen: { type: DataTypes.DECIMAL(61,8), defaultValue: null },
    postOnly: { type: DataTypes.DECIMAL(61,8), defaultValue: null },
    high24hr: { type: DataTypes.DECIMAL(61,8), defaultValue: null },
    low24hr: { type: DataTypes.DECIMAL(61,8), defaultValue: null },
  });


  module.exports = {
    Market
  }