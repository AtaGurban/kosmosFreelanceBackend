const Router = require('express')
const OrderControllers = require('../controllers/OrderControllers')
const router = new Router()



router.post('/create', OrderControllers.create)


 

module.exports = router