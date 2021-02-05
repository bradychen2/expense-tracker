// require('../../config/mongoose')
const mongoose = require('mongoose')
const Record = require('../record')
const generator = require('./randomGenerator')

mongoose.connect('mongodb://localhost/expense-tracker', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection


db.once('open', () => {
  console.log('mongodb connected!')
  for (let i = 0; i < 10; i++) {
    Record.create({
      name: `record-${i}`,
      category: 'housing',
      date: generator.randomDate(new Date('1900-01-01'), new Date('2100-12-31')),
      amount: generator.randomAmount(10000)
    })
  }
  console.log('done !')
})

