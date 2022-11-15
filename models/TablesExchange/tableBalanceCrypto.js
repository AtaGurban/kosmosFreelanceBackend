const sequelize = require("../../db");
const { DataTypes } = require("sequelize");
const { User } = require("../models");
const { Coin } = require("./tableCoin");
const { Wallet } = require("./tableWallet");


const BalanceCrypto = sequelize.define("balance-crypto", {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    balance: { type: DataTypes.DOUBLE, allowNull: false },
  });

  User.hasMany(BalanceCrypto, { as: "balance-crypto" });
  BalanceCrypto.belongsTo(User, { as: "user" });

  Coin.hasMany(BalanceCrypto, { as: "balance-crypto" });
  BalanceCrypto.belongsTo(Coin, { as: "coin" });

  Wallet.hasMany(BalanceCrypto, { as: "balance-crypto" });
  BalanceCrypto.belongsTo(Wallet, { as: "wallet" });

  module.exports = {
    BalanceCrypto
  }