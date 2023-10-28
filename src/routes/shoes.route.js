const express = require('express')
const route = express.Router()
const shoeController = require('../controller/ShoeController')
const StaticData = require("../config/utils/StaticData")
const authController = require('../controller/authController')


//using param middleware - param middleware is middleware that run only if certain parameters appears in req url
route
.param('id', shoeController.checkId)

route
.route('/')
.get(authController.protect,shoeController.getAllShoe)
.post(authController.protect,authController.restrictTo(StaticData.AUTH.Role.admin),shoeController.createShoe)

route
.route('/:id')
.get(authController.protect,shoeController.getShoe)
.patch(authController.protect,authController.restrictTo(StaticData.AUTH.Role.admin),shoeController.updateShoe)
.delete(authController.protect,authController.restrictTo(StaticData.AUTH.Role.admin),shoeController.deleteShoe)



module.exports = route