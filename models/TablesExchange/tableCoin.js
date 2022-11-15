const sequelize = require("../../db");
const { DataTypes } = require("sequelize");


const Coin = sequelize.define("balance-crypto", {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
  });


  module.exports = {
    Coin
  }