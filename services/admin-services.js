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
  }
}

module.exports = adminServices
