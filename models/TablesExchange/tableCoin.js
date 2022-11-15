const sequelize = require("../../db");
const { DataTypes } = require("sequelize");


const Coin = sequelize.define("coin", {
    kid: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    cid: { type: DataTypes.BIGINT, defaultValue: null },
    id: { type: DataTypes.BIGINT,  unique:true },
    name: { type: DataTypes.STRING, allowNull: false },
    ImageUrl: { type: DataTypes.STRING, defaultValue: null },
    url: { type: DataTypes.STRING, defaultValue: null },
    Symbol: { type: DataTypes.STRING, defaultValue: null },
    CoinName: { type: DataTypes.STRING, defaultValue: null },
    FullName: { type: DataTypes.STRING, defaultValue: null },
    Algorithm: { type: DataTypes.STRING, defaultValue: null },
    ProofType: { type: DataTypes.STRING, defaultValue: null },
    FullyPremined: { type: DataTypes.STRING, defaultValue: null },
    TotalCoinSupply: { type: DataTypes.STRING, defaultValue: null },
    PreMinedValue: { type: DataTypes.STRING, defaultValue: null },
    TotalCoinsFreeFloat: { type: DataTypes.STRING, defaultValue: null },
    SortOrder: { type: DataTypes.INTEGER, defaultValue: null },
    Sponsored: { type: DataTypes.STRING, defaultValue: null },
    createdAt:{type:DataTypes.DATE, defaultValue:'2022-11-11'}, 
    updatedAt:{type:DataTypes.DATE, defaultValue:'2022-11-11'}
  });


  module.exports = {
    Coin
  }  