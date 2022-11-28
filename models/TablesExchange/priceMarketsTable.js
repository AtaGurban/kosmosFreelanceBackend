const sequelize = require("../../db");
const { DataTypes } = require("sequelize");
const { Market } = require("./tableMarket");


const PriceMarketsTable = sequelize.define("price-markets-table", {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    date: { type: DataTypes.DATE, allowNull: false },
    priceBuy: { type: DataTypes.DOUBLE, allowNull: false },
    priceSell: { type: DataTypes.DOUBLE, allowNull: false },
  });

  Market.hasMany(PriceMarketsTable, { as: "price" });
  PriceMarketsTable.belongsTo(Market, { as: "market" });

  module.exports = {
    PriceMarketsTable
  }