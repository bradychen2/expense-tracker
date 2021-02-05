const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/expense-tracker', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.once('open', () => {
  console.log('mongodb connected!')
})

db.on('error', () => {
  console.log('mongodb error!')
})

module.exports = db