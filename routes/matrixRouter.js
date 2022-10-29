const Router = require('express')
const matrixController = require('../controllers/MatrixControllers')
const router = new Router()


router.get('/clone-stat', matrixController.getCount)
router.get('/type', matrixController.getType)
router.post('/type', matrixController.buy)
router.get('/structure', matrixController.structure)
router.get('/structure-upper', matrixController.structureUpper)


module.exports = router