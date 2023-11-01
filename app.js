const express = require('express')
const handlebars = require('express-handlebars')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('./config/passport')

const routes = require('./routes')
const { generalMessageHandler } = require('./middlewares/message-handler')
const { generalErrorHandler } = require('./middlewares/error-handler')

const app = express()
const port = process.env.PORT || 3000
const SESSION_SECRET = 'secret'
// 註冊 Handlebars 樣板引擎，並指定副檔名為 .hbs
app.engine('hbs', handlebars({ extname: '.hbs' }))
// 設定使用 Handlebars 做為樣板引擎
app.set('view engine', 'hbs')
app.set('views', './views')

app.use(express.urlencoded({ extended: true }))
app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false }))
app.use(flash()) // flash這種功能存在 session裡
app.use(passport.initialize())
app.use(passport.session())
app.use(generalMessageHandler)

app.use(routes)
app.use(generalErrorHandler)
app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`)
})

module.exports = app
