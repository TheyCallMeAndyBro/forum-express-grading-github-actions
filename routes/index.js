const express = require('express')
const router = express.Router()
const restController = require('../controllers/restaurant-controller')

router.get('/restaurants', restController.getRestaurants)
router.use('/', (req, res) => res.redirect('/restaurants')) //設定 fallback路由 如都匹配不到就會執行這行

module.exports = router
