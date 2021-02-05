// randomDate by Tomasz Nurkiewicz on Stackoverflow
randomGenerator = {
  randomDate: function (start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
  },
  randomCategory: function () {
    const category = ['housing', 'transportation', 'entertainment', 'food', 'other']
    let index = Math.floor(Math.random() * 5)
    return category[index]
  }
  ,
  randomAmount: function (max) {
    return Math.floor(Math.random() * max)
  }
}

module.exports = randomGenerator
