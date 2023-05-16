const Router = require('express')
const router = new Router()
const pictureRouter = require('./pictureRouter')
const userRouter = require('./userRouter')
const brandRouter = require('./brandRouter')
const typeRouter = require('./typeRouter')
const basketRouter = require('./basketRoutes')
const orderRouter = require('./orderRoutes')

router.use('/user', userRouter)
router.use('/type', typeRouter)
router.use('/brand', brandRouter)
router.use('/order', orderRouter)
router.use('/picture', pictureRouter)
router.use('/basket', basketRouter)

module.exports = router
