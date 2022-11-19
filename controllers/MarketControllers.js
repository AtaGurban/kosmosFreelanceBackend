const ApiError = require("../error/ApiError");
const jwt_decode = require("jwt-decode");

// const {

// } = require("../models/models");
const { Market } = require("../models/TablesExchange/tableMarket");

class MarketControllers {
  async list(req, res, next) {
    const markets = await Market.findAll();
    markets.map((i) => {
      let [market, coin] = i.pair.split('_')
      i.dataValues['market'] = market
      i.dataValues['coin']= coin
      i['lowestAsk'] = i['lowestAsk'].toFixed(10)
      i['highestBid'] = i['highestBid'].toFixed(10)
      i['baseVolume'] = i['baseVolume'].toFixed(10)
      i['high24hr'] = i['high24hr'].toFixed(10)
      i['low24hr'] = i['low24hr'].toFixed(10)
    });
    return res.json(markets);
  }
}

module.exports = new MarketControllers(); 
