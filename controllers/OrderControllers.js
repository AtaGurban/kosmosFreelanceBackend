const ApiError = require("../error/ApiError");
const jwt_decode = require('jwt-decode');
const { User } = require("../models/models");
const { OrderSale } = require("../models/TablesExchange/tableOrderSale");
const { Market } = require("../models/TablesExchange/tableMarket");
const { OrderSell } = require("../models/TablesExchange/tableOrdesSell");


class OrderControllers {
  async create(req, res, next) {
    const {amount, price, orderType, all, allCom, pair} = req.body
    const { authorization } = req.headers;
    const token = authorization.slice(7);
    const { username } = jwt_decode(token);
    const user = await User.findOne({ where: { username } });
    console.log(pair);
    const market = await Market.findOne({where:{pair}})
    if (orderType === 'buy'){
        const item = await OrderSale.create({
            amount, price, marketId:market.id, userId:user.id, summ:allCom
        }) 
        return res.json(item)
    }
    if (orderType === 'sell'){
        const item = await OrderSell.create({
            amount, price, marketId:market.id, userId:user.id, summ:allCom
        }) 
        return res.json(item)
    }
    
  } 
}

module.exports = new OrderControllers();
