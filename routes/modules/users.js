const express = require('express')
const passport = require('passport')
const router = express.Router()
const Record = require('../../models/record')
const User = require('../../models/user')

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  failureRedirect: '/users/login',
  successRedirect: '/'
}))

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  User.findOne({ email })
    .then(user => {
      if (user) {
        console.log('This email is already registered')
        return res.render('register', { name, email })
      } else {
        if (password == confirmPassword) {
          return User.create({ name, email, password })
            .then(() => {
              res.redirect('login')
            })
            .catch(err => console.log(err))
        } else {
          console.log('Password and confirmed password are not the same')
          return res.render('register', { name, email })
        }
      }
    })
    .catch(err => { console.log(err) })
})

module.exports = router