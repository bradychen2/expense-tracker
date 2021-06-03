const { check, validationResult } = require('express-validator')
const Record = require('../models/record')
const helpers = require('../public/helperFunctions')
const recordSchema = Record.schema

const recordController = {
  // Get all records
  getRecords: async (req, res) => {
    const userId = req.user._id

    try {
      const records = await Record.find({ userId }).lean().sort({ date: 'desc' })

      let totalAmount = helpers.calcTotal(records)
      req.session.records = records
      // Clean filter session 
      req.session.year = ''
      req.session.month = ''
      req.session.category = ''
      const { year, month, category } = req.session
      res.render('index', { records, totalAmount, year, month, category })

    } catch (err) {
      console.log(err)
    }
  },

  // Get create-new page
  getNew: (req, res) => {
    res.render('new')
  },

  // Create new record
  createRecord: async (req, res) => {
    const userId = req.user._id
    let record = req.body
    record.userId = userId
    const errors = validationResult(req)

    try {
      // In order to add new record into session
      // and render the view, create new record by constructor and save() 
      let newRecord = new Record(record)
      await newRecord.save()

      // Insert newRecord to records list
      records = req.session.records
      newRecord = newRecord.toObject()
      records.splice(0, 0, newRecord)

      let totalAmount = helpers.calcTotal(records)
      return res.render('index', { records, totalAmount })

    } catch (err) {
      if (!errors.isEmpty()) {
        const errorResult = { errors: errors.mapped() }
        res.render('new', { record, errorResult })
      }
      console.log(err)
    }
  },

  // Get edit page
  getEdit: async (req, res) => {
    const userId = req.user._id
    const _id = req.params.id

    try {
      const record = await Record.findOne({ userId, _id }).lean()
      res.render('edit', { record })
    } catch (err) {
      console.log(err)
    }
  },

  editRecord: async (req, res) => {
    const userId = req.user._id
    const _id = req.params.id
    const errors = validationResult(req)

    try {
      // Assign req.body to record and save
      let record = await Record.findOne({ userId, _id })
      record = Object.assign(record, req.body)
      await record.save()

      // Transform mongodb doc to object
      // Then insert updated record to records
      records = req.session.records
      record = record.toObject()
      for (let item of records) {
        if (item._id == record._id) {
          records[records.indexOf(item)] = record
        }
      }

      let totalAmount = helpers.calcTotal(records)
      return res.render('index', { records, totalAmount })
    } catch (err) {
      if (!errors.isEmpty()) {
        const errorResult = { errors: errors.mapped() }
        req.body._id = _id
        res.render('edit', { record: req.body, errorResult })
      }
      console.log(err)
    }
  },

  filterRecords: async (req, res) => {
    const userId = req.user._id
    const { year, month, category } = req.body

    // Build filter condition
    const filterCondition = helpers.buildFilterCond(year, month, category, userId)

    // Initialize the condition of projection
    // Add two new properties, year and month
    const projectCondition = { year: { $year: '$date' }, month: { $month: '$date' } }

    // Preserve all the original properties of Record
    recordSchema.eachPath(path => {
      // {property1: true, property2: true, ...}
      projectCondition[path] = 1
    })

    try {
      // Get filtered records
      const records =
        await Record.aggregate([
          { $project: projectCondition },
          { $match: { $and: filterCondition } }
        ]).sort({ date: 'desc' })

      let totalAmount = helpers.calcTotal(records)
      req.session.year = year
      req.session.month = month
      req.session.category = category
      req.session.records = records
      res.render('index', { records, totalAmount, year, month, category })
    } catch (err) {
      console.log(err)
    }
  },

  deleteRecord: async (req, res) => {
    const userId = req.user._id
    const _id = req.params.id

    try {
      let record = await Record.findOne({ userId, _id })
      await Record.deleteOne({ userId, _id })

      // Delete record in records
      records = req.session.records
      for (let i = 0; i < records.length; i++) {
        if (records[i]._id == record._id) {
          records.splice(i, 1)
        }
      }

      let totalAmount = helpers.calcTotal(records)
      return res.render('index', { records, totalAmount })
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = recordController