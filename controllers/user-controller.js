const db = require('../models')
const { User } = db
const bcrypt = require('bcryptjs')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res) => {
    bcrypt.hash(req.body.password, 10)
      .then(hash =>
        // User.create 加上前後{} 就需加上return 需要取用他的值 如沒有用{} 也是有用return只是省略而已
        User.create({
          name: req.body.name,
          email: req.body.email,
          password: hash
        }))
      .then(() => res.redirect('/signin'))
  }
}

module.exports = userController
