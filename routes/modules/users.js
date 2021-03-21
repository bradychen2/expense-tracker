const express = require('express')
const router = express.Router()
const Record = require('../../models/record')

router.get('/login', (req, res) => {
  res.send('Login')
})

router.post('/login', (req, res) => {
  res.send('Login')
})

router.get('/register', (req, res) => {
  res.send('Register')
})

router.post('/register', (req, res) => {
  res.send('Register')
})

module.exports = router