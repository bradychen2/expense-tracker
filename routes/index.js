const userController = require('../controllers/userController')
const recordController = require('../controllers/recordController')
const helpers = require('../public/helperFunctions')

module.exports = (app, passport) => {
  function authenticator(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
    req.flash('warning_msg', '請先登入才能使用！')
    res.redirect('/users/login')
  }

  // ------------------Facebook------------------
  app.get('/auth/facebook', passport.authenticate('facebook', {
    scope: ['email', 'public_profile']
  }))

  app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/users/login'
  }))

  // --------------------User--------------------
  app.get('/users/login', userController.signInPage)
  app.get('/users/register', userController.signUpPage)
  app.post('/users/login', passport.authenticate('local', {
    failureRedirect: '/users/login',
    successRedirect: '/',
    failureFlash: true
  }))
  app.post('/users/register', userController.signUp)
  app.get('/users/logout', userController.signOut)

  // -------------------Record-------------------
  app.get('/', authenticator, recordController.getRecords)
  app.get('/back', authenticator, (req, res) => {
    const records = req.session.records
    let totalAmount = helpers.calcTotal(records)
    res.render('index', { records, totalAmount })
  })
  app.get('/records/new', authenticator, recordController.getNew)
  app.post('/records', authenticator, recordController.createRecord)
  app.get('/records/edit/:id', authenticator, recordController.getEdit)
  app.put('/records/:id', authenticator, recordController.editRecord)
  app.post('/records/filter', authenticator, recordController.filterRecords)
  app.delete('/records/:id', authenticator, recordController.deleteRecord)
}
