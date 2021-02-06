const Handlebars = require("handlebars")

Handlebars.registerHelper('formatTime', function (dayTime) {
  let recordDate = new Date(dayTime)
  const year = recordDate.getFullYear()
  const month = recordDate.getMonth() + 1
  const date = recordDate.getDate()
  return year + '-' + month + '-' + date
})
