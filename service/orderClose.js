const { fn, col } = require("sequelize");
const { Op } = require("sequelize");
const { Chart } = require("../models/TablesExchange/tableChart");
const { HistoryBargain } = require("../models/TablesExchange/tableHistoryBargain");
const { Market } = require("../models/TablesExchange/tableMarket");
const { OrderSale } = require("../models/TablesExchange/tableOrderSale");
const { OrderSell } = require("../models/TablesExchange/tableOrdesSell");



module.exports = async (orders, amount, orderType, userId, marketId, allCom, all, price)=>{
    if (orderType === 'buy'){
        orders.sort((a, b)=>{return b.price - a.price})
    } else {
        orders.sort((a, b)=>{return a.price - b.price})
    }
    orders.map(async (i, index)=>{
        if (((+amount) >= (+i.amount)) && ((+amount) > 0)){
            //History
            console.log('1');
            console.log('amount', amount);
            console.log('i.amount', i.amount);
            if (orderType !== 'buy'){
                const historyItem = await HistoryBargain.create({
                    tradeID:marketId, date: new Date(), type:'buy', rate: i.amount, amount:i.amount, total:all, totalWithCom:allCom, userId, orderSaleId:i.id
                })
            } else {
                const historyItem = await HistoryBargain.create({
                    tradeID:marketId, date: new Date(), type:'sell', rate: i.amount, amount:i.amount, total:all, totalWithCom:allCom, userId, orderSellId:i.id
                })
            }
            const totalAmount = await HistoryBargain.findAll({
                attributes: [
                    'tradeID',
                  [fn('sum', col('total')), 'total_amount'],
                ],
                group: ['tradeID'],
                raw: true, where:{tradeID:marketId, date:{[Op.gte]: new Date(new Date() - 24 * 60 * 60 * 1000)} }
              });
            //Chart
            // const chartItem = await Chart.create({
            //     date:(+new Date()),
            //     high: i.price,

            // })
            //Market
            const marketForUpdate = await Market.findOne({where:{id:marketId}})
            const marketUpdate = {high24hr:i.price, last:i.price, baseVolume:totalAmount[0].total_amount, percentChange:((i.price * 100) / marketForUpdate.high24hr)}
            await Market.update(marketUpdate, {where:{id:marketId}})
            amount = (amount - i.amount).toFixed(10)
            console.log('amount w konsedadasdsadsadasfdasdasdasdfasfasfasdasdasdasdasdasdas',amount);
            i.destroy()
            if ((orders.length === index + 1) && ((+amount) > 0)){
                if (orderType === 'buy'){
                    const item = await OrderSale.create({
                        amount, price: price, marketId, userId, summ:(((+amount) * (+price)) * 1.02)
                    }) 
                    return (item)
                } else {
                    const item = await OrderSell.create({
                        amount, price: price, marketId, userId, summ:(((+amount) * (+price)) * 0.98)
                    }) 
                    // const historyItem = await HistoryBargain.create({
                    //     tradeID:marketId, date: new Date(), type:'sell', rate: amount, amount:amount, total:allCom, userId, orderSellId:i.id
                    // })
                    return (item)
                }
            } else{
                return true
            }
        }else{
            console.log('2');
            console.log('amount', amount);
            console.log('i.amount', i.amount);
            if (orderType !== 'buy'){
                const historyItem = await HistoryBargain.create({
                    tradeID:marketId, date: new Date(), type:'buy', rate: i.amount, amount:i.amount, total:allCom, totalWithCom:allCom, userId, orderSaleId:i.id
                })
                let update = {amount: ((+i.amount) - (+amount)).toFixed(10), summ:((((+i.amount) - amount).toFixed(10) * (+i.price)) * 0.98)}
                await OrderSale.update(update, {where:{id:i.id}})
            }else{
                const historyItem = await HistoryBargain.create({
                    tradeID:marketId, date: new Date(), type:'sell', rate: i.amount, amount:i.amount, total:allCom, totalWithCom:allCom, userId, orderSaleId:i.id
                })
                let update = {amount: ((+i.amount) - (+amount)).toFixed(10), summ:((((+i.amount) - amount).toFixed(10) * (+i.price)) * 1.02)}
                await OrderSell.update(update, {where:{id:i.id}})
            }
            const totalAmount = await HistoryBargain.findAll({
                attributes: [
                    'tradeID',
                  [fn('sum', col('total')), 'total_amount'],
                ],
                group: ['tradeID'],
                raw: true, where:{tradeID:marketId, date:{[Op.gte]: new Date(new Date() - 24 * 60 * 60 * 1000)} }
              });
            const marketForUpdate = await Market.findOne({where:{id:marketId}})
            const marketUpdate = {high24hr:i.price, baseVolume:totalAmount[0].total_amount, percentChange:((i.price * 100) / marketForUpdate.high24hr)}
            await Market.update(marketUpdate, {where:{id:marketId}})
            amount = 0
            return true
        }
    })
}