const Router = require('express')
const InvestControllers = require('../controllers/InvestControllers')
const router = new Router()



router.post('/', InvestControllers.create)




module.exports = router