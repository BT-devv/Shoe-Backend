const express = require('express')
const route = express.Router()
const StaticData = require("../config/utils/StaticData")
const reviewController = require('../controller/ReviewController.js')
const authController = require('../controller/authController.js')

//using param middleware - param middleware is middleware that run only if certain parameters appears in req url
route.param('id', reviewController.checkID);


route
.route('/')
.get(authController.protect,reviewController.getAllReviews)
.post(authController.protect,reviewController.createReview)

route
.route('/:id')
.get(authController.protect,authController.restrictTo(StaticData.AUTH.Role.admin),reviewController.getReview)
.patch(authController.protect,reviewController.updateReview)
.delete(authController.protect,authController.restrictTo(StaticData.AUTH.Role.admin),reviewController.deleteReview)



module.exports = route