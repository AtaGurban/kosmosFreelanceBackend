const { Op } = require("sequelize");
const { HistoryBargain } = require("../models/TablesExchange/tableHistoryBargain");
const { Market } = require("../models/TablesExchange/tableMarket");



class ExchangeHistoryControllers {
  async list(req, res, next) {
    const {command, currencyPair, start, end} = req.query
    if (command === 'returnTradeHistory'){
      if ((currencyPair.split('').length > 3) && start && end){
        const tradeID = (await Market.findOne({where:{pair:currencyPair}})).id
        // const historyItems = await HistoryBargain.findAll({where : {date : {[Op.between] : [new Date(+start), new Date(+end)]},tradeID }})
        const historyItems = await HistoryBargain.findAll({where : {tradeID }})
        let result = []
        historyItems.map((i)=>{
          result.push({globalTradeID:tradeID, tradeID, date:i.date, type:i.type, rate:i.rate, amount:i.amount, total:i.total, orderNumber:null})
        })
        return res.json(result)
      }
    }
  }
}

module.exports = new ExchangeHistoryControllers(); 
  