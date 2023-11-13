const express = require('express')
const router = express.Router()

const adminController = require('../../../controllers/pages/admin-controller')
const categoryController = require('../../../controllers/pages/category-controller')

const upload = require('../../../middlewares/multer')

router.get('/restaurants/create', adminController.createRestaurant)
router.get('/restaurants/:id/edit', adminController.editRestaurant)
router.get('/restaurants/:id', adminController.getRestaurant)
router.put('/restaurants/:id', upload.single('image'), adminController.putRestaurant) // upload.single('內填入要上傳的name名稱')
router.delete('/restaurants/:id', adminController.deleteRestaurant)
router.get('/restaurants', adminController.getRestaurants)
router.post('/restaurants', upload.single('image'), adminController.postRestaurant)

router.get('/users', adminController.getUsers)
router.patch('/users/:id', adminController.patchUser)

router.get('/categories/:id', categoryController.getCategories)
router.put('/categories/:id', categoryController.putCategory)
router.delete('/categories/:id', categoryController.deleteCategory)
router.get('/categories', categoryController.getCategories)
router.post('/categories', categoryController.postCategory)

router.get('/', (req, res) => res.redirect('/admin/restaurants')) // 設定 fallback路由 如都匹配不到就會執行這行 => get更改成use

module.exports = router
