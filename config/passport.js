const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const { User, Restaurant } = require('../models')

// set up Passport strategy
passport.use(new LocalStrategy(
  // customize user field
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  // authenticate user
  (req, email, password, cb) => {
    User.findOne({ where: { email } })
      .then(user => {
        if (!user) return cb(null, false, req.flash('error', '帳號或密碼輸入錯誤！'))
        bcrypt.compare(password, user.password).then(res => {
          if (!res) return cb(null, false, req.flash('error', '帳號或密碼輸入錯誤！'))
          return cb(null, user)
        })
      })
  }
))
// serialize and deserialize user
passport.serializeUser((user, cb) => {
  cb(null, user.id) // 我只回傳user.id進session
})
passport.deserializeUser((id, cb) => {
  User.findByPk(id, {
    include: [
      { model: Restaurant, as: 'FavoritedRestaurants' }
      // 會多出FavoritedRestaurants資料 裡面裝載被User加入最愛的Restaurant資料 及Favorite的object
    ]
  })
    .then(user => cb(null, user.toJSON()))
    .catch(err => cb(err))
})

module.exports = passport
