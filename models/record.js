const mongoose = require('mongoose')
const Schema = mongoose.Schema

const recordSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['housing', 'transportation', 'entertainment', 'food', 'other'],
    required: true
  },
  date: {
    type: Date,
    required: true,
    min: '1900-01-01',
    max: '2100-12-31'
  },
  amount: {
    type: Number,
    required: true
  },
  merchant: {
    type: String,
    required: false
  }
})

module.exports = mongoose.model('Record', recordSchema)