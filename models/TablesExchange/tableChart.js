const sequelize = require("../../db");
const { DataTypes } = require("sequelize");


const Chart = sequelize.define("chart", {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    date: { type: DataTypes.BIGINT, allowNull: false },
    high: { type: DataTypes.DOUBLE, allowNull: false },
    low: { type: DataTypes.DOUBLE, allowNull: false },
    open: { type: DataTypes.DOUBLE, allowNull: false },
    close: { type: DataTypes.DOUBLE, allowNull: false },
    volume: { type: DataTypes.DOUBLE, allowNull: false },
    quoteVolume: { type: DataTypes.DOUBLE, allowNull: false },
    weightedAverage: { type: DataTypes.DOUBLE, allowNull: false },
  });

  module.exports = {
    Chart
  }