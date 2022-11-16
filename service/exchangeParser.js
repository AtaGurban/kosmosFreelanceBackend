const cheerio = require('cheerio');
const axios = require('axios');
const { Market } = require('../models/TablesExchange/tableMarket');

module.exports = async () => {
  const getHTML = async (url) => {
    const { data } = await axios.get(url);
    return cheerio.load(data);
  };

  const $ = await getHTML(`https://yobit.net/ru/market/`);
  const marketItems = $('#market_table tbody tr')
  marketItems.each(async(i, element)=>{
    const title = $(element).find('td a').text()
    await Market.create({
      pair:title,
      last:0.0000004711,
      lowestAsk:0.0000004710,
      highestBid:0.0000004444,
      percentChange:0.0700000000,
      baseVolume:0.0037625969,
      quoteVolume:8142.0000000000,
      isFrozen:0,
      postOnly:0,
      high24hr:0.0000004711,
      low24hr:0.0000004400
    }) 
  })
}; 
