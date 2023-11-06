// hbs.helpers適合做比較複雜的模板操作處理
const dayjs = require('dayjs')

module.exports = {
  currentYear: () => dayjs().year(),
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  }
}
