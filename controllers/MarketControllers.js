const ApiError = require("../error/ApiError");
const jwt_decode = require("jwt-decode");

// const {

// } = require("../models/models");
const { Market } = require("../models/TablesExchange/tableMarket");


class MarketControllers {

    async list(req, res, next) {
        const markets = await Market.findAll()


        return res.json(markets)
    }

}


module.exports = new MarketControllers();