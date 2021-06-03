const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const passport = require('./config/passport')
const mainRouters = require('./routes')
require('./config/mongoose')


// Set require const for server
const app = express()
const PORT = process.env.PORT

// Set template engine
app.engine('hbs', exphbs({
  helpers: require('./public/handlebarsHelpers'),
  defaultLayout: 'main',
  extname: 'hbs'
}))
app.set('view engine', 'hbs')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(flash())

// Session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))

// Passport
app.use(passport.initialize())
app.use(passport.session())

app.use(express.static('./public'))

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  res.locals.records = req.session.records
  res.locals.year = req.session.year
  res.locals.month = req.session.month
  res.locals.category = req.session.category
  next()
})

app.listen(PORT, () => {
  console.log(`Server is listening on 'http://localhost:${PORT}'`)
})

mainRouters(app, passport)

module.exports = app
