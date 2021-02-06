const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const Record = require('./models/record')
require('./config/mongoose')

const app = express()
const port = 3000

app.engine('hbs', exphbs({
  helpers: require('./views/handlebarsHelpers'),
  defaultLayout: 'main',
  extname: 'hbs'
}))
app.set('view engine', 'hbs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))


app.get('/', (req, res) => {
  return Record.find()
    .lean()
    .sort({ date: 'desc' })
    .then(records => res.render('index', { records }))
    .catch(error => console.log(error))
})


app.get('/records/edit/:id', (req, res) => {
  const id = req.params.id
  return Record.findById(id)
    .lean()
    .then(record => res.render('edit', { record }))
    .catch(error => { console.log(error) })
})

app.put('/records/:id', (req, res) => {
  const id = req.params.id
  return Record.findById(id)
    .then((record) => {
      record = Object.assign(record, req.body)
      return record.save()
    })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})


app.delete('/records/:id', (req, res) => {
  const id = req.params.id
  return Record.findById(id)
    .then(record => record.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})


app.listen(port, () => {
  console.log(`Server is listening on 'http://localhost:${port}'`)
})