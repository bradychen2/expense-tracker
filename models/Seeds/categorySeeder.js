const Record = require('../record')
const User = require('../user')
const generator = require('./randomGenerator')
const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV != 'production') {
  require('dotenv').config()
}
const db = require('../../config/mongoose')
const SEED_USER = {
  name: 'example',
  email: 'example@example.com',
  password: '123456789'
}

db.once('open', async () => {

  try {
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(SEED_USER.password, salt)
    const user = await User.create({
      name: SEED_USER.name,
      email: SEED_USER.email,
      password: hash
    })
    const userId = user._id

    for (let i = 0; i < 20; i++) {
      await Record.create({
        name: `record-${i}`,
        category: generator.randomCategory(),
        date: generator.randomDate(new Date('2021-01-01'), new Date('2021-12-31')),
        amount: generator.randomAmount(10000),
        userId
      })
    }

    console.log('done!')
    process.exit()

  } catch (err) {
    console.log(err)
  }
})