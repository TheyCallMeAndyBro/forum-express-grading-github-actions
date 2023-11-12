// 用物件的方式儲存
const { Restaurant, Category, Comment, User, Favorite } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helpers')

const restaurantController = {
  getRestaurants: (req, res) => {
    const DEFAULT_LIMIT = 9

    const categoryId = Number(req.query.categoryId) || '' // 變成數字是因為 id在db資料庫值為integer

    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)

    return Promise.all([
      Restaurant.findAndCountAll({
        include: Category,
        where: {
          ...(categoryId ? { categoryId } : {})
        },
        limit,
        offset,
        nest: true,
        raw: true
      }),
      Category.findAll({ raw: true })
    ])
      .then(([restaurants, categories]) => {
        const favoritedRestaurantsId = req.user && req.user.FavoritedRestaurants.map(fr => fr.id)
        const likedRestaurantsId = req.user && req.user.LikedRestaurants.map(lr => lr.id)
        const data = restaurants.rows.map(r => ({
          ...r,
          description: r.description.substring(0, 50), // 修改...r的description 縮減資料到50個字
          isFavorited: favoritedRestaurantsId.includes(r.id),
          isLiked: likedRestaurantsId.includes(r.id)
        }))
        return res.render('restaurants', {
          restaurants: data,
          categories,
          categoryId,
          pagination: getPagination(limit, page, restaurants.count)
        })
      })
  },
  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: [
        Category,
        { model: Comment, include: User },
        // 先找 Category 再找 Comment 再利用 Comment 關係找 User 使用User資料就變成Restaurant.Comment.User.id
        { model: User, as: 'FavoritedUsers' },
        { model: User, as: 'LikedUsers' }
      ],
      order: [[Comment, 'createdAt', 'DESC']]
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return restaurant.increment('viewCounts', { by: 1 })
      })
      .then(restaurant => {
        const isFavorited = restaurant.FavoritedUsers.some(fs => fs.id === req.user.id)
        const isLiked = restaurant.LikedUsers.some(ls => ls.id === req.user.id)
        res.render('restaurant', {
          restaurant: restaurant.toJSON(),
          isFavorited,
          isLiked
        })
      })
      .catch(err => next(err))
  },
  getDashboard: (req, res, next) => {
    return Promise.all([
      Restaurant.findByPk(req.params.id, {
        include: [Category],
        raw: true,
        nest: true
      }),
      Comment.count({ where: { restaurantId: req.params.id } }),
      Favorite.count({ where: { restaurantId: req.params.id } })
    ])
      .then(([restaurant, commentCount, favoriteCount]) => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        res.render('dashboard', { restaurant, commentCount, favoriteCount })
      })
      .catch(err => next(err))
  },
  getFeeds: (req, res, next) => {
    return Promise.all([
      Restaurant.findAll({
        limit: 10,
        order: [['createdAt', 'DESC']],
        include: [Category],
        raw: true,
        nest: true
      }),
      Comment.findAll({
        limit: 10,
        order: [['createdAt', 'DESC']],
        include: [User, Restaurant],
        raw: true,
        nest: true
      })
    ])
      .then(([restaurants, comments]) => {
        res.render('feeds', {
          restaurants,
          comments
        })
      })
      .catch(err => next(err))
  },
  getTopRestaurants: (req, res, next) => {
    return Restaurant.findAll({
      include: [{ model: User, as: 'FavoritedUsers' }]
    })
      .then(restaurants => {
        const favoritedRestaurantsId = req.user && req.user.FavoritedRestaurants.map(fr => fr.id)
        const result = restaurants.map(r => ({
          ...r.toJSON(),
          favoritedCount: r.FavoritedUsers.length,
          isFavorited: favoritedRestaurantsId.includes(r.id)
        }))
          .sort((a, b) => b.favoritedCount - a.favoritedCount)
          .slice(0, 10)

        return res.render('top-restaurants', { restaurants: result })
      })
      .catch(err => next(err))
  }
}
module.exports = restaurantController
