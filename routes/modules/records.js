const express = require('express')
const { check, validationResult } = require('express-validator')
const { startSession } = require('../../models/record')
const router = express.Router()
const Record = require('../../models/record')
const recordSchema = Record.schema

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
  , async (req, res) => {
    const userId = req.user._id
    let record = req.body
    record.userId = userId
    const errors = validationResult(req)

    try {
      // In order to add new record into session
      // and render the view, create new record by constructor and save() 
      let newRecord = new Record(record)
      await newRecord.save()

      // Insert newRecord to records list
      records = req.session.records
      newRecord = newRecord.toObject()
      records.splice(0, 0, newRecord)

      let totalAmount = calcTotal(records)
      return res.render('index', { records, totalAmount })

    } catch (err) {
      if (!errors.isEmpty()) {
        const errorResult = { errors: errors.mapped() }
        res.render('new', { record, errorResult })
      }
      console.log(err)
    }
  })

// Go to edit page
router.get('/edit/:id', async (req, res) => {
  const userId = req.user._id
  const _id = req.params.id

  try {
    const record = await Record.findOne({ userId, _id }).lean()
    res.render('edit', { record })
  } catch (err) {
    console.log(err)
  }
})

// Edit record
router.put('/:id', [
  check('name').notEmpty().withMessage('名稱為必填欄位!'),
  check('date').notEmpty().withMessage('日期為必填欄位!'),
  check('amount').notEmpty().withMessage('金額為必填欄位!')
]
  , async (req, res) => {
    const userId = req.user._id
    const _id = req.params.id
    const errors = validationResult(req)

    try {
      // Assign req.body to record and save
      let record = await Record.findOne({ userId, _id })
      record = Object.assign(record, req.body)
      await record.save()

      // Transform mongodb doc to object
      // Then insert updated record to records
      records = req.session.records
      record = record.toObject()
      for (let item of records) {
        if (item._id == record._id) {
          records[records.indexOf(item)] = record
        }
      }

      let totalAmount = calcTotal(records)
      return res.render('index', { records, totalAmount })
    } catch (err) {
      if (!errors.isEmpty()) {
        const errorResult = { errors: errors.mapped() }
        req.body._id = _id
        res.render('edit', { record: req.body, errorResult })
      }
      console.log(err)
    }
  })

// Filter
router.post('/filter', async (req, res) => {
  const userId = req.user._id
  const { year, month, category } = req.body

  // Always filter by userId
  const filterCondition = [{ userId: userId }]

  // Initialize the condition of projection
  // Add two new properties, year and month
  const projectCondition = { year: { $year: '$date' }, month: { $month: '$date' } }

  // Establish the filter condition
  if (year.length !== 0) {
    filterCondition.push({ year: Number(year) })
  }
  if (month.length !== 0) {
    filterCondition.push({ month: Number(month) })
  }
  if (category.length !== 0) {
    filterCondition.push({ category: category })
  }
  // Preserve all the original properties of Record
  recordSchema.eachPath(path => {
    // {property1: true, property2: true, ...}
    projectCondition[path] = 1
  })

  try {
    // Get filtered records
    const records =
      await Record.aggregate([
        { $project: projectCondition },
        { $match: { $and: filterCondition } }
      ]).sort({ date: 'desc' })

    let totalAmount = calcTotal(records)
    req.session.year = year
    req.session.month = month
    req.session.category = category
    req.session.records = records
    res.render('index', { records, totalAmount, year, month, category })
  } catch (err) {
    console.log(err)
  }
})

// Delete record
router.delete('/:id', async (req, res) => {
  const userId = req.user._id
  const _id = req.params.id

  try {
    let record = await Record.findOne({ userId, _id })
    await Record.deleteOne({ userId, _id })

    // Delete record in records
    records = req.session.records
    for (let i = 0; i < records.length; i++) {
      if (records[i]._id == record._id) {
        records.splice(i, 1)
      }
    }

    let totalAmount = calcTotal(records)
    return res.render('index', { records, totalAmount })
  } catch (err) {
    console.log(err)
  }
})

function calcTotal(records) {
  let totalAmount = 0
  for (record of records) {
    totalAmount += record.amount
  }
  return totalAmount
}

module.exports = router