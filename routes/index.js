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
  app.get('/back', authenticator, (req, res, next) => {
    try {
      const records = req.session.records
      let totalAmount = helpers.calcTotal(records)
      res.render('index', { records, totalAmount })
    } catch (err) {
      console.log(err)
      next(err)
    }
  })
  app.get('/records/new', authenticator, recordController.getNew)
  app.post('/records', authenticator, recordController.createRecord)
  app.get('/records/edit/:id', authenticator, recordController.getEdit)
  app.put('/records/:id', authenticator, recordController.editRecord)
  app.post('/records/filter', authenticator, recordController.filterRecords)
  app.delete('/records/:id', authenticator, recordController.deleteRecord)

  // --------------------Error--------------------
  // 404 Not Found
  app.use((req, res, next) => {
    res.status(404)

    if (req.accepts('json')) {
      res.json({ error: '404 - Not Found' })
      return
    }
    res.type('text/plain').send('404 - Not Found')
  })

  // 500 Server Error
  app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500)

    if (req.accepts('json')) {
      res.json({ error: '500 - Server Error' })
      return
    }
    res.type('plain/text').send('500 - Server Error')
  })
}
