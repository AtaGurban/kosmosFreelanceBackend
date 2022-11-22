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
        if ((+i.price) === (+arr[j].price)){
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
    let {amount, price, orderType, all, allCom, pair} = req.body
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
        return await OrderClose(orderCheck, amount, orderType, user.id, market.id, allCom, all, price)
      }
      const item = await OrderSale.create({
          amount, price, marketId:market.id, userId:user.id, summ:allCom, sumWithOutCom:all
      }) 
      return res.json(item)
    }
    if (orderType === 'sell'){
      const orderCheck = await OrderSale.findAll({where:{marketId:market.id, price: { [Op.gte]: price }}})
      if (orderCheck.length > 0){
        return await OrderClose(orderCheck, amount, orderType, user.id, market.id, allCom, all, price)
      }
        const item = await OrderSell.create({
            amount, price, marketId:market.id, userId:user.id, summ:allCom, sumWithOutCom:all
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
      const filteredOrdersSales = findDublicatePrice(orderSale).sort((a, b)=>{return b.price - a.price})
      const filteredOrdersSells = findDublicatePrice(orderSell).sort((a, b)=>{return a.price - b.price})
      let result = {asks:[], bids:[], "isFrozen": "0", "postOnly": "0", "seq": 4878868}
      filteredOrdersSells.map((i)=>{
        result.asks.push([`${(i.price).toFixed(8)}`, `${i.amount.toFixed(8)}`, `${i.summ.toFixed(8)}`])
      })
      filteredOrdersSales.map((i)=>{
        result.bids.push([`${i.price.toFixed(8)}`, `${i.amount.toFixed(8)}`, `${i.summ.toFixed(8)}`])
      })
      return res.json(result)
    }
    
  } 
}

module.exports = new OrderControllers();
