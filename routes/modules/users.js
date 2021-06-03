const express = require('express')
const passport = require('passport')
const bcrypt = require('bcryptjs')
const router = express.Router()
const User = require('../../models/user')

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  failureRedirect: '/users/login',
  successRedirect: '/',
  failureFlash: true
}))

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', async (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  const errors = []

  // Input form check
  if (!name | !email | !password | !confirmPassword) {
    errors.push({ message: '所有欄位都為必填！' })
  }
  if (password !== confirmPassword) {
    errors.push({ message: '密碼與確認密碼不相符！' })
  }
  if (errors.length) {
    return res.render('register', {
      name,
      email,
      errors
    })
  }

  try {
    const user = await User.findOne({ email })
    // Confirm email is registered or not
    if (user) {
      errors.push({ message: '此 Email 已經註冊過！' })
      return res.render('register', { name, email, errors })

    } else {
      // Email not exists, create User and redirect
      const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash(password, salt)
      await User.create({ name, email, password: hash })
      res.redirect('/users/login')
    }
  } catch (err) {
    console.log(err)
  }
})

router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', '你已經成功登出！')
  res.redirect('/users/login')
})

module.exports = router