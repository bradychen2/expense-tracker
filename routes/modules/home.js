const express = require('express')
const router = express.Router()
const Record = require('../../models/record')

// Home
router.get('/', (req, res) => {
  const userId = req.user._id
  return Record.find({ userId })
    .lean()
    .sort({ date: 'desc' })
    .then(records => {
      let totalAmount = 0
      for (record of records) {
        totalAmount += record.amount
      }

      req.session.records = records
      res.render('index', { records, totalAmount })
    })
    .catch(error => console.log(error))
})

module.exports = router