const express = require('express')
const { check, validationResult } = require('express-validator')
const router = express.Router()
const Record = require('../../models/record')

// Go to create-new page
router.get('/new', (req, res) => {
  res.render('new')
})

// Create new expense record
router.post('/', [
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
          const errorResult = { errors: errors.mapped() }
          res.render('new', { record, errorResult })
        }
      })
  })

// Go to edit page
router.get('/edit/:id', (req, res) => {
  const id = req.params.id
  return Record.findById(id)
    .lean()
    .then(record => res.render('edit', { record }))
    .catch(error => { console.log(error) })
})

// Edit record
router.put('/:id', [
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
          const errorResult = { errors: errors.mapped() }
          res.render('edit', { record, errorResult })
        }
      })
  })

// Filter by category
router.get('/filter/:category', (req, res) => {
  const category = req.params.category
  return Record.find({ category: `${category}` })
    .lean()
    .sort({ date: 'desc' })
    .then(records => {
      let totalAmount = 0
      for (record of records) {
        totalAmount += record.amount
      }
      res.render('index', { records, totalAmount })
    })
})

// Delete record
router.delete('/:id', (req, res) => {
  const id = req.params.id
  return Record.findById(id)
    .then(record => record.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

module.exports = router