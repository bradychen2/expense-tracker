const express = require('express')
const router = express.Router()
const Record = require('../../models/record')

// Home
router.get('/', (req, res) => {
  return Record.find()
    .lean()
    .sort({ date: 'desc' })
    .then(records => {
      let totalAmount = 0
      for (record of records) {
        totalAmount += record.amount
      }
      res.render('index', { records: records, totalAmount })

    })
    .catch(error => console.log(error))
})

module.exports = router