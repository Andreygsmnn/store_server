require('dotenv').config()  //чтобы читались глобальные переменные .env

const express = require('express') 

const sequelize = require('./db') //импортируем настроенную orm 
const models = require('./models/models')  //импортируем все модели
const cors = require('cors')  //импорт для запросов из браузера
const fileUpload = require('express-fileupload') // для работы с файлами изображениями
const path = require('path')

const router = require('./routes/index')  //импортируем маршруты

const handlerError = require('./middleware/ErrorHandleMiddleware') //импортируем ошибки

const PORT = process.env.PORT || 6000 

const app = express();    //создание экспресс сервера
app.use(cors()); //возможность запросов из браузера
app.use(express.json())  //возможность парсить json серверу
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(fileUpload({}))
app.use('/api',router) 

app.use(handlerError) //важно использование ошибок размещать в конце!!!


const start = async ()=>{
    try{
         await sequelize.authenticate() //подключение к базе данных
         await sequelize.sync()   //синхронизация моделей в бд
         app.listen(PORT, ()=> console.log(`server starting on Port ${PORT}`)) //запуск сервера на порту 

    }catch(e){
        console.log(e)
    }
}

start()



