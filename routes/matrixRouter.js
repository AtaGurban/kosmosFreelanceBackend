const Router = require('express')
const matrixController = require('../controllers/MatrixControllers')
const PegasUnoControllers = require('../controllers/PegasUnoControllers')

const router = new Router()


router.get('/clone-stat', matrixController.getCount)
router.get('/uno/clone-stat', PegasUnoControllers.getCloneStat)
router.get('/clone', matrixController.clone)
router.get('/uno/clone', PegasUnoControllers.clone)
router.get('/type', matrixController.getType)
router.get('/uno/type', PegasUnoControllers.getType)
router.post('/buy', matrixController.buy)
router.post('/uno/buy', PegasUnoControllers.buy)
router.post('/target-install-clone', matrixController.targetClone)
router.post('/uno/target-install-clone', PegasUnoControllers.targetClone)
router.get('/structure', matrixController.structure)
router.get('/uno/structure', PegasUnoControllers.structure)
router.get('/structure-upper', matrixController.structureUpper)
router.get('/uno/structure-upper', PegasUnoControllers.structureUpper) 


module.exports = router 