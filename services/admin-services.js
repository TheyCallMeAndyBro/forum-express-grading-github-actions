const { Restaurant, Category } = require('../models')

const adminServices = {
  getRestaurants: (req, cb) => {
    return Restaurant.findAll({
      raw: true,
      nest: true, // 讓他從 Restaurant[Category.id] => Restaurant.Category.id 比較好理解
      include: [Category] // 包含Category的資料
    })
      .then(restaurants => {
        return cb(null, { restaurants })
      })
      .catch(err => cb(err))
  },
  deleteRestaurant: (req, cb) => {
    return Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        if (!restaurant) throw new Error('Restaurant did not exist!')
        // 也可用Restaurant.update寫法 裡面多添加where 就好
        return restaurant.destroy()
      })
      .then(deletedRestaurant => {
        return cb(null, { restaurant: deletedRestaurant })
        // req.flash('success_messages', 'Delete successfully!')
        // res.redirect('/admin/restaurants')
      })
      .catch(err => cb(err))
  }
}

module.exports = adminServices
