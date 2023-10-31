const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')

router.get('/restaurants', adminController.getRestaurants)
router.use('/', (req, res) => res.redirect('/admin/restaurants')) // 設定 fallback路由 如都匹配不到就會執行這行

module.exports = router