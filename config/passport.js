const passport = require('passport')
const User = require('../models/user')
const LocalStrategy = require('passport-local').Strategy

module.exports = app => {
  app.use(passport.initialize())
  app.use(passport.session())

  passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    User.findOne({ email })
      .then(user => {
        if (!user) {
          return done(null, false, { message: 'This email is not registered!' })
        } else {
          if (user.password != password) {
            return done(null, false, { message: 'Email or password incorrect.' })
          }
          return done(null, user)
        }
      }).catch(err => {
        console.log(err)
      })
  }))

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .then(user => {
        done(null, user)
      })
      .catch(err => done(err, null))
  })
}