const ApiError = require("../error/ApiError");
const jwt_decode = require('jwt-decode');
const { User } = require("../models/models");
const { OrderSale } = require("../models/TablesExchange/tableOrderSale");
const { Market } = require("../models/TablesExchange/tableMarket");
const { OrderSell } = require("../models/TablesExchange/tableOrdesSell");
const OrderClose = require("../service/OrderClose");
const { Op } = require("sequelize");

const findDublicatePrice = (arr)=>{
  let res = []
  arr.map((i, ind)=>{
    for (let j = ind + 1; j < arr.length; j++) {
        if (i.price === arr[j].price){
          res.push([ind, j])
        }    
    } 
  })
  res.map((k)=>{
    if(arr[k[0]] && arr[k[1]]){
      arr[k[0]].amount = arr[k[0]].amount + arr[k[1]].amount
      arr[k[0]].summ = arr[k[0]].summ + arr[k[1]].summ
      arr.splice(k[1], 1)
    }
  })
  return arr
}
class OrderControllers {
  async create(req, res, next) {
    const {amount, price, orderType, all, allCom, pair} = req.body
    if (!amount || !price || !orderType || !all || !allCom || !pair){
      return next(ApiError.badRequest("Недостаточно средств"));
    }
    const { authorization } = req.headers;
    const token = authorization.slice(7);
    const { username } = jwt_decode(token);
    const user = await User.findOne({ where: { username } });
    const market = await Market.findOne({where:{pair}})
    if (orderType === 'buy'){
      const orderCheck = await OrderSell.findAll({where:{marketId:market.id, price: { [Op.lte]: price }}})
      if (orderCheck.length > 0){
        return await OrderClose(orderCheck, amount, orderType, user.id, market.id, allCom)
      }
      const item = await OrderSale.create({
          amount, price, marketId:market.id, userId:user.id, summ:allCom
      }) 
      return res.json(item)
    }
    if (orderType === 'sell'){
      const orderCheck = await OrderSale.findAll({where:{marketId:market.id, price: { [Op.gte]: price }}})
      if (orderCheck.length > 0){
        return await OrderClose(orderCheck, amount, orderType, user.id, market.id, allCom)
      }
        const item = await OrderSell.create({
            amount, price, marketId:market.id, userId:user.id, summ:allCom
        }) 
        return res.json(item)
    }
    
  } 
  async getAll(req, res, next) {
    const {command, currencyPair, depth} = req.query
    if (command === 'returnOrderBook'){
      const market = await Market.findOne({where:{pair:currencyPair}})
      const orderSale = await OrderSale.findAll({where:{marketId:market.id}})
      const orderSell = await OrderSell.findAll({where:{marketId:market.id}})
      const filteredOrdersSales = findDublicatePrice(orderSale)
      const filteredOrdersSells = findDublicatePrice(orderSell)
      let result = {asks:[], bids:[], "isFrozen": "0", "postOnly": "0", "seq": 4878868}
      filteredOrdersSells.map((i)=>{
        result.asks.push([`${i.price}`, `${i.amount}`, `${i.summ}`])
      })
      filteredOrdersSales.map((i)=>{
        result.bids.push([`${i.price}`, `${i.amount}`, `${i.summ}`])
      })
      return res.json(result)
    }
    
  } 
}

module.exports = new OrderControllers();
