const { User, Cart } = require('../models/models')
const jwt = require('jsonwebtoken')
const ApiError = require('../error/apiError')
const bcrypt = require('bcrypt')

const generateJwtToken = (id,email,role) => {
  return jwt.sign(
    { id, email, role },           //данные пользователя
    process.env.SECRET_KEY,        //рандомная строка
    { expiresIn: '24h' }           //продолжительность жизни токена
  )
}

class UserController {
  async registration(req, res, next) {
    const { email, password, role } = req.body
    if (!email || !password) {
      return next(ApiError.badRequest('Неправильный логин или пароль'))
    }
    const candidate = await User.findOne({ where: { email } })
    if (candidate) {
      return next(ApiError.badRequest('Такой пользователь уже существует'))
    }
    const hashPassword = await bcrypt.hash(password, 5)        //хешируем пароль


    const user = await User.create({ email, password: hashPassword, role }) //создаем пользователя с захешированым паролем
    const cart = await Cart.create({ userId: user.id })  //создаем корзину для пользователя 
    const token = generateJwtToken(user.id, user.email, user.role)

    return res.json({ token })
  }

  async login(req, res,next) {
    const {email,password} = req.body
    const user = await User.findOne({where : {email}})                //проверяем на наличие пользователя
    if(!user){
       return next(ApiError.internal("Пользователь с таким email не найден"))
    }
    let comparePassword = bcrypt.compareSync(password, user.password)
    if(!comparePassword){
       return next(ApiError.internal("Неверный пароль"))
    }

    const token = generateJwtToken(user.id, user.email, user.role)
    return res.json({token})
  }

  async check(req, res, next) {
     const token = generateJwtToken(req.user.id, req.user.email, req.user.role)
     return res.json({token})
  }
}

module.exports = new UserController()