const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const { check, validationResult } = require('express-validator')
require('./config/mongoose')

const Record = require('./models/record')


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

// Home
app.get('/', (req, res) => {
  return Record.find()
    .lean()
    .sort({ date: 'desc' })
    .then(records => res.render('index', { records }))
    .catch(error => console.log(error))
})

// Go to create page
app.get('/records/new', (req, res) => {
  res.render('new')
})

// Create new expense record
app.post('/records', [
  check('name').notEmpty().withMessage('名稱為必填欄位!'),
  check('date').notEmpty().withMessage('日期為必填欄位!'),
  check('category').notEmpty().withMessage('類型為必填欄位!'),
  check('amount').notEmpty().withMessage('金額為必填欄位!')
]
  , (req, res) => {
    const record = req.body
    const errors = validationResult(req)
    return Record.create(record)
      .then(() => res.redirect('/'))
      .catch(() => {
        if (!errors.isEmpty()) {
          const errorResult = { errors: validationResult(req).mapped() }
          res.render('new', { record, errorResult })
        }
      })
  })

// Go to edit page
app.get('/records/edit/:id', (req, res) => {
  const id = req.params.id
  return Record.findById(id)
    .lean()
    .then(record => res.render('edit', { record }))
    .catch(error => { console.log(error) })
})

// Edit record
app.put('/records/:id', [
  check('name').notEmpty().withMessage('名稱為必填欄位!'),
  check('date').notEmpty().withMessage('日期為必填欄位!'),
  check('amount').notEmpty().withMessage('金額為必填欄位!')
]
  , (req, res) => {
    const id = req.params.id
    const errors = validationResult(req)
    return Record.findById(id)
      .then(record => {
        record = Object.assign(record, req.body)
        return record.save()
      })
      .then(() => res.redirect('/'))
      .catch(() => {
        if (!errors.isEmpty()) {
          const record = req.body
          record._id = id
          const errorResult = { errors: validationResult(req).mapped() }
          res.render('edit', { record, errorResult })
        }
      })
  })

// Delete record
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