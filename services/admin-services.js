const { Restaurant, Category } = require('../models')
const { localFileHandler } = require('../helpers/file-helpers')

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
  postRestaurant: (req, cb) => {
    const { name, tel, address, openingHours, description, categoryId } = req.body
    if (!name) throw new Error('Restaurant name is required !')

    const { file } = req // 這邊要獲取的是req中file這個檔案 而req.body.file 獲取的是 name=file 輸入的字串

    localFileHandler(file) // 傳入req獲取的file 有無檔案邏輯已在helpers內做完
      .then(filePath => { // filePath為最後resolve的`/${fileName}`路徑字符串
        return Restaurant.create({ name, tel, address, openingHours, description, image: filePath || null, categoryId })
      })

      .then(createdRestaurant => {
        return cb(null, { restaurant: createdRestaurant })
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
      })
      .catch(err => cb(err))
  }
}

module.exports = adminServices
