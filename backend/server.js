const express = require('express')

const cors = require('cors')
const router = require('./router') // содержит все файлы маршрутов
const mongoose = require('mongoose')
const port = process.env.PORT || 3001
require('dotenv').config()

try {
    mongoose.set('useNewUrlParser', true); // настройки для замены депрекейтов
    mongoose.set('useFindAndModify', false);
    mongoose.set('useCreateIndex', true);
    mongoose.connect('mongodb://localhost:27017/journallist', { useUnifiedTopology: true });

} catch (e) {
    console.log(e)
}

const app = express()
app.use(express.json())
app.use(cors())
app.use(router)


app.listen(port)