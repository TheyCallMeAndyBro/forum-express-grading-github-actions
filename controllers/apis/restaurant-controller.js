const restaurantService = require('../../services/restaurant-services')

const restaurantController = {
  getRestaurants: (req, res, next) => {
    restaurantService.getRestaurants(req, (err, data) => err ? next(err) : res.json(data))
  }
}

module.exports = restaurantController
