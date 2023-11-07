// 用物件的方式儲存
const { Restaurant, Category } = require('../models')

const restaurantController = {
  getRestaurants: (req, res) => {
    const categoryId = Number(req.query.categoryId) || '' // 變成數字是因為 id在db資料庫值為integer
    return Promise.all([
      Restaurant.findAll({
        include: Category,
        where: {
          ...(categoryId ? { categoryId } : {})
        },
        nest: true,
        raw: true
      }),
      Category.findAll({ raw: true })
    ])
      .then(([restaurants, categories]) => {
        const data = restaurants.map(r => ({
          ...r,
          description: r.description.substring(0, 50) // 修改...r的description 縮減資料到50個字
        }))
        return res.render('restaurants', {
          restaurants: data,
          categories,
          categoryId
        })
      })
  },
  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, { include: Category })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        restaurant.increment('viewCounts', { by: 1 })
        res.render('restaurant', { restaurant: restaurant.toJSON() })
      })
      .catch(err => next(err))
  },
  getDashboard: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: Category,
      raw: true,
      nest: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        res.render('dashboard', { restaurant })
      })
      .catch(err => next(err))
  }
}
module.exports = restaurantController
