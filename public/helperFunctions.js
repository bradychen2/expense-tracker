const helpers = {
  calcTotal: (records) => {
    let totalAmount = 0
    for (record of records) {
      totalAmount += record.amount
    }
    return totalAmount
  },

  buildFilterCond: (year, month, category, userId) => {
    // Always filter by userId
    const filterCondition = [{ userId: userId }]

    // Establish the filter condition
    if (year.length !== 0) {
      filterCondition.push({ year: Number(year) })
    }
    if (month.length !== 0) {
      filterCondition.push({ month: Number(month) })
    }
    if (category.length !== 0) {
      filterCondition.push({ category: category })
    }

    return filterCondition
  }
}

module.exports = helpers