const Router = require('express')
const router = new Router()
const pictureController = require('../controllers/pictureController')

router.post('/', pictureController.create)
router.get('/', pictureController.getAll)
router.put('/',pictureController.update)
router.delete('/:id',pictureController.delete)


module.exports = router
