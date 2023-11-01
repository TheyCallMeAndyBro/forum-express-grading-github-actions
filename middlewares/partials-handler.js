const { getUser } = require('../helpers/auth-helpers')
// const { currentYear } = require('../helpers/handlebars-helpers')

module.exports = {
  generalPartialsHandler (req, res, next) {
    res.locals.success_messages = req.flash('success')
    res.locals.error_messages = req.flash('error')
    res.locals.user = getUser(req)
    // res.locals.currentYear = currentYear() // 可以這樣寫存在res.locals丟進views渲染出來 或是直接用 hbs helpers功能

    next()
  }
}
