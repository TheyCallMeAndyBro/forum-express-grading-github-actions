//用物件的方式儲存
const restaurantController = {
  getRestaurants: (req, res) => {
    return res.render('restaurants')
  }
}
module.exports = restaurantController
