const { Op } = require("sequelize")
const { Market } = require("../models/TablesExchange/tableMarket")
const { OrderSale } = require("../models/TablesExchange/tableOrderSale")
const { OrderSell } = require("../models/TablesExchange/tableOrdesSell")
const OrderClose = require("./OrderClose")



const createOrder = async (markets, price, amount, difference) => {
  // let priceForBuy = (+price).toFixed(8)
  // let priceForSell = ((+price) + (+difference)).toFixed(8)
  // let summForBuy = ((priceForBuy * amount) * 1.02).toFixed(8)
  // let summForSell = ((priceForBuy * amount) * 0.98).toFixed(8)
  let med = Math.round(price / 2);
  markets.map(async (market) => {
    for (let i = difference; i < med; i = i + difference) {
      const orderCheckBuyFirst = await OrderSale.findOne({ where: { marketId: market.id, price: i } })
      if (!orderCheckBuyFirst) {
        const orderCheckBuy = await OrderSell.findAll({ where: { marketId: market.id, price: { [Op.lte]: i } } })
        if (orderCheckBuy.length > 0) {
          return await OrderClose(orderCheckBuy, amount, 'buy', 1, market.id, ((i * amount) * 1.02), (i * amount), i)
        }
        const itemBuy = await OrderSale.create({
          amount, price: i, marketId: market.id, userId: 1, summ: ((i * amount) * 1.02), sumWithOutCom:(i * amount)
        })
      }
    }
    for (let i = med; i < (price + difference); i = i + difference) {
      const orderCheckSellFirst = await OrderSell.findOne({ where: { marketId: market.id, price: i } })
      if (!orderCheckSellFirst) {
        const orderCheckSell = await OrderSale.findAll({ where: { marketId: market.id, price: { [Op.gte]: i } } })
        if (orderCheckSell.length > 0) {
          return await OrderClose(orderCheckSell, amount, 'sell', 1, market.id, ((i * amount) * 0.98), (i * amount), i)
        }
        const itemBuy = await OrderSell.create({
          amount, price: i, marketId: market.id, userId: 1, summ: ((i * amount) * 0.98), sumWithOutCom:(i * amount)
        })
      }
    }


    // const orderCheckSell = await OrderSale.findAll({ where: { marketId: market.id, price: { [Op.gte]: priceForSell } } })
    // if (orderCheckSell.length > 0) {
    //   return await OrderClose(orderCheckSell, amount, 'sell', 1, market.id, summForSell, all, priceForSell)
    // }
    // const itemSell = await OrderSell.create({
    //   amount, price: priceForSell, marketId: market.id, userId: 1, summ: summForSell
    // })
    // return res.json(item)
  })

}


module.exports = async () => {
  let price = 20
  let amount = 0.00010000
  let difference = 1
  const markets = await Market.findAll()
  await createOrder(markets, price, amount, difference)
}