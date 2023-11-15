const { Restaurant, User, Category } = require('../../models')
const { localFileHandler } = require('../../helpers/file-helpers')

const adminServices = require('../../services/admin-services')

const adminController = {
  getRestaurants: (req, res, next) => {
    adminServices.getRestaurants(req, (err, data) => err ? next(err) : res.render('admin/restaurants', data))
  },
  createRestaurant: (req, res, next) => {
    return Category.findAll({
      raw: true
    })
      .then(categories => res.render('admin/create-restaurant', { categories }))
      .catch(err => next(err))
  },
  postRestaurant: (req, res, next) => {
    adminServices.postRestaurant(req, (err, data) => {
      if (err) return next(err)
      req.flash('success_messages', 'restaurant was successfully created')
      req.session.createdData = data
      return res.redirect('/admin/restaurants')
    })
  },
  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      raw: true,
      nest: true,
      include: [Category]
    })
      .then(restaurant => {
        if (!restaurant) throw new Error('Restaurant did not exist!')
        res.render('admin/restaurant', { restaurant })
        // 在只有單筆資料時候 可以使用 { restaurant: restaurant.toJSON() } 取代  raw: true, nest: true,
      })
      .catch(err => next(err))
  },
  editRestaurant: (req, res, next) => {
    return Promise.all([
      Restaurant.findByPk(req.params.id, { raw: true }),
      Category.findAll({ raw: true })
    ])
      .then(([restaurant, categories]) => {
        if (!restaurant) throw new Error('Restaurant did not exist!')

        res.render('admin/edit-restaurant', { restaurant, categories })
      })
      .catch(err => next(err))
  },
  putRestaurant: (req, res, next) => {
    const { name, tel, address, openingHours, description, categoryId } = req.body
    if (!name) throw new Error('Restaurant name is required !')

    const { file } = req // 這邊要獲取的是req中file這個檔案 而req.body.file 獲取的是 name=file 輸入的字串

    // 傳入req獲取的file 有無檔案邏輯已在helpers內做完
    // Promise.all([a.b]) Promise.all會把參數a,b做完 .then會收到a.b的結果 在執行 .then([a,b])
    return Promise.all([
      Restaurant.findByPk(req.params.id),
      localFileHandler(file)
    ])
      .then(([restaurant, filePath]) => {
        if (!restaurant) throw new Error('Restaurant did not exist!')
        // 也可用Restaurant.update寫法 裡面多添加where 就好
        // image: filePath || restaurant.image 如果有編輯照片 就用新的 沒有用舊的
        return restaurant.update({ name, tel, address, openingHours, description, image: filePath || restaurant.image, categoryId })
      })

      .then(() => {
        req.flash('success_messages', 'Update successfully!')
        res.redirect('/admin/restaurants')
      })
      .catch(err => next(err))
  },
  deleteRestaurant: (req, res, next) => {
    adminServices.deleteRestaurant(req, (err, data) => {
      if (err) return next(err)
      req.flash('success_messages', 'Delete successfully!')
      req.session.deletedData = data
      return res.redirect('/admin/restaurants')
    })
  },
  getUsers: (req, res) => {
    return User.findAll({
      raw: true
    })
      .then(users => res.render('admin/users', { users }))
  },
  patchUser: (req, res, next) => {
    return User.findByPk(req.params.id)
      .then(user => {
        if (!user) throw new Error('User did not exist!')
        if (user.email === 'root@example.com') {
          req.flash('error_messages', '禁止變更 root 權限')
          return res.redirect('back')
        }
        return user.update({
          isAdmin: !user.isAdmin
        })
      })
      .then(() => {
        req.flash('success_messages', '使用者權限變更成功')
        return res.redirect('/admin/users')
      })
      .catch(err => next(err))
  }
}
module.exports = adminController
