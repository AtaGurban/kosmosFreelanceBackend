const Router = require('express')
const CasinoControllers = require('../controllers/CasinoControllers')
const router = new Router()



router.post('/admin', CasinoControllers.admin)




module.exports = router