const Handlebars = require("handlebars")

Handlebars.registerHelper('formatTime', function (dayTime) {
  // Need transform type when retrieve from mongodb
  let recordDate = new Date(dayTime)
  let year = recordDate.getFullYear()
  let month = recordDate.getMonth() + 1
  let date = recordDate.getDate()
  if (month < 10) { month = '0' + month }
  if (date < 10) { date = '0' + date }
  return year + '-' + month + '-' + date
})

Handlebars.registerHelper('judgeCategory', function (recordCategory, currCategory) {
  if (recordCategory === currCategory) {
    return 'selected'
  }
  return
})
