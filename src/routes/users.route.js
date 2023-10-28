const express = require('express')
const route = express.Router()
const userController = require('../controller/UserController.js')
const StaticData = require("../config/utils/StaticData")
const authController = require('../controller/authController')

route.post('/signup',authController.signup)
route.post('/login',authController.login)
//using param middleware - param middleware is middleware that run only if certain parameters appears in req url
route
.param('id', userController.checkID)


route
.route('/')
.get(authController.protect,authController.restrictTo(StaticData.AUTH.Role.admin),userController.getAllUsers)
.post(authController.protect,authController.restrictTo(StaticData.AUTH.Role.admin),userController.creatUser)

route
.route('/:id')
.get(authController.protect,userController.getUser)
.patch(authController.protect,authController.restrictTo(StaticData.AUTH.Role.admin),userController.updateUser)
.delete(authController.protect,authController.restrictTo(StaticData.AUTH.Role.admin),userController.deleteUser)



module.exports = route