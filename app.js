const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const routes = require('./routes')
require('./config/mongoose')

// Set require const for server
const app = express()
const PORT = process.env.PORT || 3000

// Set template engine
app.engine('hbs', exphbs({
  helpers: require('./views/handlebarsHelpers'),
  defaultLayout: 'main',
  extname: 'hbs'
}))
app.set('view engine', 'hbs')

// Set static files
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static('./public'))
app.use(routes)

app.listen(PORT, () => {
  console.log(`Server is listening on 'http://localhost:${PORT}'`)
})