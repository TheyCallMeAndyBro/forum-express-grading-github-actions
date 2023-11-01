// hbs.helpers式合作比較複雜的模板操作處理
const dayjs = require('dayjs')

module.exports = {
  currentYear: () => dayjs().year()
}
