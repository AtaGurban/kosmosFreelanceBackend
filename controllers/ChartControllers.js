const { HistoryBargain } = require("../models/TablesExchange/tableHistoryBargain");
const { Op } = require("sequelize");
const { Market } = require("../models/TablesExchange/tableMarket");

class ChartControllers {
  async list(req, res, next) {
    const {command, currencyPair, start, end, period} = req.query
    if (command === 'returnChartData'){
        if (currencyPair && start && end && period){
            const tradeID = (await Market.findOne({where:{pair:currencyPair}})).id
            const historyItems = await HistoryBargain.findAll({where : {date : {[Op.between] : [new Date(+start), new Date(+end)]},tradeID }})
            let periods = [];
            let bool = true
            let periodStart = (+start);
            let periodEnd = (+start) + (+period)
            do {
                let period = historyItems.filter((j)=>{
                    let dateToMs = new Date(j.date).getTime()
                    return ((dateToMs > periodStart) && (dateToMs < periodEnd))
                })
                // console.log(period.length);
                if (period.length > 0){
                    periods.push(period)
                    periodStart += period
                    periodEnd += period 
                } else {
                    periodStart += period
                    periodEnd += period  
                    bool = false
                }
                console.log(periodEnd);  
              } while (periodEnd < end);
              return res.json(periods)
        }
    }
  }
}

module.exports = new ChartControllers(); 
