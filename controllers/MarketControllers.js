const ApiError = require("../error/ApiError");
const jwt_decode = require("jwt-decode");

// const {

// } = require("../models/models");
const { Market } = require("../models/TablesExchange/tableMarket");

class MarketControllers {
  async list(req, res, next) {
    const markets = await Market.findAll();
    let result = {};
    markets.map((i) => {
      let {
        id,
        last,
        lowestAsk,
        highestBid,
        percentChange,
        baseVolume,
        quoteVolume,
        isFrozen,
        postOnly,
        high24hr,
        low24hr,
      } = i;
      result[i.pair] = {
        id,
        last,
        lowestAsk,
        highestBid,
        percentChange,
        baseVolume,
        quoteVolume,
        isFrozen,
        postOnly,
        high24hr,
        low24hr,
      };
    });
    return res.json(result);
  }
}

module.exports = new MarketControllers();
