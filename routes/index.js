const Router = require('express')
const router = new Router()


const brandRouter = require('./brandRouter')
const productRouter = require('./productRouter')
const typeRouter = require('./typeRouter')
const userRouter = require('./userRouter')

router.use('/type', typeRouter)
router.use('/brand', brandRouter)
router.use('/product',productRouter)
router.use('/user', userRouter)


module.exports = router
