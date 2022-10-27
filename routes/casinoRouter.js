const Router = require('express')
const CasinoControllers = require('../controllers/CasinoControllers')
const router = new Router()



router.get('/admin', CasinoControllers.admin)




module.exports = router