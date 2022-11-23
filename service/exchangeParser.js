const cheerio = require('cheerio');
const axios = require('axios');

const { Market } = require('../models/TablesExchange/tableMarket');
const OrderClose = require('./OrderClose');
const { OrderSale } = require('../models/TablesExchange/tableOrderSale');
const { OrderSell } = require('../models/TablesExchange/tableOrdesSell');
const { Op } = require('sequelize');

module.exports = async () => {
  const getHTML = async (url) => {
    const { data } = await axios.get(url);
    return cheerio.load(data);
  };

  // const markets = await Market.findAll()
  const $ = await getHTML(`https://yobit.net/ru/trade/BTC/RUR`);
      const bestSell = $('#label_bestsell').text()
      // const bestSell = 200000000
      const bestBuy = $('#label_bestbuy').text()
      let marketId = 963;
      let amount = 0.001
      const orderCheckBuyNull = await OrderSale.findAll({where: {marketId, price: { [Op.gt]: (+bestSell) }}})
      orderCheckBuyNull.map(async(i)=>{
        await OrderClose([i], amount, 'sell', 1, marketId, ((bestSell * amount) * 0.98), (bestSell * amount), bestSell)
      })
      const orderCheckBuyFirst = await OrderSale.findOne({ where: { marketId: marketId, price: bestSell } })
      if (!orderCheckBuyFirst) {
        const orderCheckBuy = await OrderSell.findAll({ where: { marketId: marketId, price: { [Op.lte]: bestSell } } })
        if (orderCheckBuy.length > 0) {
          await OrderClose(orderCheckBuy, amount, 'buy', 1, marketId, ((bestSell * amount) * 1.02), (bestSell * amount), bestSell)
        }
        const itemBuy = await OrderSale.create({
          amount, price: bestSell, marketId, userId: 1, summ: ((bestSell * amount) * 1.02), sumWithOutCom:(bestSell * amount)
        })
      }
      const orderCheckSellNull = await OrderSell.findAll({where: {marketId, price: { [Op.lt]: bestBuy }}})
      console.log(bestBuy);
      console.log(orderCheckSellNull);
      orderCheckSellNull.map(async(i)=>{
        await OrderClose([i], amount, 'sell', 1, marketId, ((bestBuy * amount) * 1.02), (bestBuy * amount), bestBuy)
      })

      const orderCheckSellFirst = await OrderSell.findOne({ where: { marketId, price: bestBuy } })
      if (!orderCheckSellFirst) {
        const orderCheckSell = await OrderSale.findAll({ where: { marketId, price: { [Op.gte]: bestBuy } } })
        if (orderCheckSell.length > 0) {
          await OrderClose(orderCheckSell, amount, 'sell', 1, marketId, ((bestBuy * amount) * 0.98), (bestBuy * amount), bestBuy)
        }
        const itemBuy = await OrderSell.create({
          amount, price: bestBuy, marketId, userId: 1, summ: ((bestBuy * amount) * 0.98), sumWithOutCom:(bestBuy * amount)
        })
      }
  // markets.map(async (i)=>{
  //     let pair = i.pair.split('_').reverse().join('/');
  //     const $ = await getHTML(`https://yobit.net/ru/trade/${pair}`);
  //     const bestSell = $('#label_bestsell').text()
  //     const bestBuy = $('#label_bestbuy').text()
  //     console.log(bestSell);
  //     console.log(bestBuy); 
  // })
  // const $ = await getHTML(`https://yobit.net/ru/market/`);
  // const marketItems = $('#market_table tbody tr')
  // marketItems.each(async(i, element)=>{
  //   const title = $(element).find('td a').text()
  //   const pair = title.split('/').join('_')
  //   await Market.create({
  //     pair,
  //     last:0.0000004711,
  //     lowestAsk:0.0000004710,
  //     highestBid:0.0000004444,
  //     percentChange:0.0700000000,
  //     baseVolume:0.0037625969,
  //     quoteVolume:8142.0000000000,
  //     isFrozen:0,
  //     postOnly:0,
  //     high24hr:0.0000004711, 
  //     low24hr:0.0000004400
  //   }) 
  // })
}; 
