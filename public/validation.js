const { check, validationResult } = require('express-validator')

const validated = {
  checkList: [
    check('name').notEmpty().withMessage('名稱為必填欄位!'),
    check('date').notEmpty().withMessage('日期為必填欄位!'),
    check('category').notEmpty().withMessage('類型為必填欄位!'),
    check('amount').notEmpty().withMessage('金額為必填欄位!')
  ],

  validationResult
}


module.exports = validated