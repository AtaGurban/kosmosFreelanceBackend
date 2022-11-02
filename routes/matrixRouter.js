const Router = require('express')
const matrixController = require('../controllers/MatrixControllers')
const router = new Router()


router.get('/clone-stat', matrixController.getCount)
router.get('/clone', matrixController.clone)
router.get('/type', matrixController.getType)
router.post('/buy', matrixController.buy)
router.post('/target-install-clone', matrixController.targetClone)
router.get('/structure', matrixController.structure)
router.get('/structure-upper', matrixController.structureUpper)


module.exports = router