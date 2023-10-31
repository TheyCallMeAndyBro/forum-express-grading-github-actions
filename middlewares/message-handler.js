module.exports = {
  generalMessageHandler (req, res, next) {
    res.locals.success_messages = req.flash('success')
    res.locals.error_messages = req.flash('error')

    next()
  }
}
