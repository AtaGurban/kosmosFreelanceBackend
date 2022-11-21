const { HistoryBargain } = require("../models/TablesExchange/tableHistoryBargain");
const { Op } = require("sequelize");
const { Market } = require("../models/TablesExchange/tableMarket");
const chartPeriod = require("../service/chartPeriod");

class ChartControllers {
  async list(req, res, next) {
    const {command, currencyPair, start, end, period: period} = req.query
    // let periodMs = Math.round(((+period) * 1000) / 70)
    let periodMs = period * 2
    if (command === 'returnChartData'){
        if (currencyPair && start && end && periodMs){
            const tradeID = (await Market.findOne({where:{pair:currencyPair}})).id
            const historyItems = await HistoryBargain.findAll({where : {date : {[Op.between] : [new Date(+start), new Date(+end)]},tradeID }})
            let periods = [];
            let bool = true
            let counter = 0;
            if (historyItems.length > 0){
              let periodStart = (+new Date(historyItems[0].date)); 
              let periodEnd = periodStart + (+periodMs)
              do {
                  let periodArr = historyItems.filter((j)=>{
                      let dateToMs = new Date(j.date).getTime()
                      return ((dateToMs >= periodStart) && (dateToMs <= periodEnd))
                  })
                  // console.log(period.length);
                  if (periodArr.length > 0){
                      periods.push({periodArr, date: periodEnd})
                      periodStart += (+periodMs)
                      periodEnd += (+periodMs)
                      counter++
                      if (counter === historyItems.length){
                        bool = false 
                      } 
                  } else {
                      periodStart += (+periodMs)
                      periodEnd += (+periodMs)    
                  }  
                } while ((periodEnd < end) && (bool));  
                // return res.json(periods)
                return res.json(await chartPeriod(periods))
            }
        }
    }
  }
}

module.exports = new ChartControllers(); 
