const express = require('express')
const route = express.Router()
const orderController = require('../controller/OrderController')

const StaticData = require("../config/utils/StaticData")
const authController = require('../controller/authController')

route.param('id',orderController.checkID)

route
.route('/')
.get(authController.protect,authController.restrictTo(StaticData.AUTH.Role.admin),orderController.getAllOrder)
.post(authController.protect,authController.restrictTo(StaticData.AUTH.Role.admin),orderController.createOrder)

route
.route('/:id')
.get(authController.protect,authController.restrictTo(StaticData.AUTH.Role.admin),orderController.getOrder)
.patch(authController.protect,authController.restrictTo(StaticData.AUTH.Role.admin),orderController.updateOrder)
.delete(authController.protect,authController.restrictTo(StaticData.AUTH.Role.admin),orderController.deleteOrder)

module.exports = route