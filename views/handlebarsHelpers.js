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

Handlebars.registerHelper('displayIcon', function (record) {
  if (record.category === 'housing') {
    return `<i class="fas fa-home fs-2"></i>`
  } else if (record.category === 'transportation') {
    return `<i class="fas fa-shuttle-van fs-2"></i>`
  } else if (record.category === 'entertainment') {
    return `<i class="fas fa-grin-beam fs-2 mx-1"></i>`
  } else if (record.category === 'food') {
    return `<i class="fas fa-utensils fs-2 mx-1"></i>`
  } else {
    return `<i class="fas fa-pen fs-2 mx-1"></i>`
  }
})

