const Router = require('express')
const GameControllers = require('../controllers/GameControllers')
const router = new Router()



router.post('/', GameControllers.project)




module.exports = router