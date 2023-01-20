const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController'); //подключаем контроллер
const authMiddleware = require('../middleware/authMiddleware')

router.post('/registration', userController.registration) //присобачиваем функции из контроллера к маршруту
router.post('/login', userController.login)
router.get('/auth',authMiddleware ,userController.check)



module.exports = router