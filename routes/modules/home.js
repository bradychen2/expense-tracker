const express = require('express')
const router = express.Router()
const Record = require('../../models/record')

// Home
router.get('/', async (req, res) => {
  const userId = req.user._id

  try {
    const records = await Record.find({ userId }).lean().sort({ date: 'desc' })

    let totalAmount = calcTotal(records)
    req.session.records = records
    // Clean filter session 
    req.session.year = ''
    req.session.month = ''
    req.session.category = ''
    const { year, month, category } = req.session
    res.render('index', { records, totalAmount, year, month, category })

  } catch (err) {
    console.log(err)
  }
})

// Cancel from edit or new
router.get('/back', (req, res) => {
  const records = req.session.records
  let totalAmount = calcTotal(records)
  res.render('index', { records, totalAmount })
})

function calcTotal(records) {
  let totalAmount = 0
  for (record of records) {
    totalAmount += record.amount
  }
  return totalAmount
}

module.exports = router