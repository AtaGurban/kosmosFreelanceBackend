const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
const matrixRouter = require('./matrixRouter')
const newsRouter = require('./newsRouter')
const structureRouter = require('./structureRouter')
const walletRouter = require('./walletRouter')
const StarRouter = require('./starRouter')
const GameRouter = require('./gameRouter')
const InvestRouter = require('./InvestRouter')
const CasinoRouter = require('./casinoRouter')
const MarketRouter = require('./marketRouter')


   
router.use('/user', userRouter)
router.use('/matrix', matrixRouter) 
router.use('/news', newsRouter)
router.use('/structure', structureRouter)
router.use('/wallet', walletRouter)
router.use('/star-trek', StarRouter)
router.use('/v2/invest_box', InvestRouter)
router.use('/html5/evoplay', GameRouter)
router.use('/casino', CasinoRouter)
router.use('/marketslist', MarketRouter)



module.exports = router 