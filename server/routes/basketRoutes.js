const Router = require('express')
const router = new Router()
const basketController = require('../controllers/basketController')

router.post('/', basketController.create)
router.get('/:userId', basketController.getAll)
router.delete('/:id', basketController.delete)

module.exports = router
