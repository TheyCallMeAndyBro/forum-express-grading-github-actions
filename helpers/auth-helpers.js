const authHelpers = {
  getUser: req => {
    return req.user || null
  },

  ensureAuthenticated: req => {
    return req.isAuthenticated()
  }

}

module.exports = authHelpers
