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

Handlebars.registerHelper('generateYear', function (records, inputYear) {
  yearList = []
  for (let record of records) {
    let date = new Date(record.date)
    let year = date.getFullYear()
    if (!yearList.includes(year)) {
      yearList.push(year)
    }
  }

  yearList.sort()
  let yearOptions = ''
  if (!inputYear) {
    yearOptions += '<option value="" selected>請選擇年分</option>'
  } else {
    yearOptions += '<option value="">請選擇年分</option>'
  }

  for (let year of yearList) {
    if (year != inputYear) {
      yearOptions += `<option value=${year} id="year-${year}">${year}</option >`
    } else {
      yearOptions += `<option value=${year} id="year-${year}" selected>${year}</option >`
    }
  }
  return yearOptions
})

Handlebars.registerHelper('generateMonth', function (records, inputMonth) {
  monthList = []
  for (let record of records) {
    let date = new Date(record.date)
    let month = date.getMonth() + 1
    if (!monthList.includes(month)) {
      monthList.push(month)
    }
  }

  monthList.sort()

  monthList.sort()
  let monthOptions = ''
  if (!inputMonth) {
    monthOptions += '<option value="" selected>請選擇月份</option>'
  } else {
    monthOptions += '<option value="">請選擇月份</option>'
  }

  for (let month of monthList) {
    if (month != inputMonth) {
      monthOptions += `<option value=${month} id="month-${month}">${month}</option >`
    } else {
      monthOptions += `<option value=${month} id="month-${month}" selected>${month}</option >`
    }
  }
  return monthOptions
})

Handlebars.registerHelper('generateCategory', function (inputCat) {
  const categoryList = [
    { housing: '家庭物業' },
    { transportation: '交通出行' },
    { entertainment: '休閒娛樂' },
    { food: '餐飲食品' },
    { other: '其他' }
  ]
  let categoryOptions = ''
  if (!inputCat) {
    categoryOptions += `<option value="" selected>所有類型</option>`
  } else {
    categoryOptions += `<option value="">所有類型</option>`
  }
  for (let option of categoryList) {
    if (Object.keys(option)[0] !== inputCat) {
      categoryOptions += `
      <option value="${Object.keys(option)[0]}">${option[Object.keys(option)[0]]}</option>`
    } else {
      categoryOptions += `
      <option value="${Object.keys(option)[0]}" selected>${option[Object.keys(option)[0]]}</option>`
    }
  }
  return categoryOptions
})

Handlebars.registerHelper('judgeCategory', function (recordCategory, currCategory) {
  if (recordCategory === currCategory) {
    return 'selected'
  }
  return
})

Handlebars.registerHelper('displayIcon', function (record) {
  if (record.category === 'housing') {
    return `<i class="fas fa-home fs-1"></i>`
  } else if (record.category === 'transportation') {
    return `<i class="fas fa-shuttle-van fs-1"></i>`
  } else if (record.category === 'entertainment') {
    return `<i class="fas fa-grin-beam fs-1 mx-1"></i>`
  } else if (record.category === 'food') {
    return `<i class="fas fa-utensils fs-1 mx-1"></i>`
  } else {
    return `<i class="fas fa-pen fs-1 mx-1"></i>`
  }
})


