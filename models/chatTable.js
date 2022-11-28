const sequelize = require("../db");
const { DataTypes } = require("sequelize");



const ChatTable = sequelize.define("chat", {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    date: { type: DataTypes.STRING, allowNull: false },
    message: { type: DataTypes.STRING, allowNull: false },
    author: { type: DataTypes.STRING, allowNull: false },
  });


  module.exports = {
    ChatTable
  } 