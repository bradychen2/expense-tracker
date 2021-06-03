// require('../../config/mongoose')
const mongoose = require('mongoose')
const Record = require('../record')
const generator = require('./randomGenerator')

mongoose.connect('mongodb://localhost/expense-tracker', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection


db.once('open', () => {
  console.log('mongodb connected!')
  for (let i = 10; i < 20; i++) {
    Record.create({
      name: `record-${i}`,
      category: generator.randomCategory(),
      date: generator.randomDate(new Date('2020-01-01'), new Date('2021-12-31')),
      amount: generator.randomAmount(10000)
    })
  }
  console.log('done !')
})