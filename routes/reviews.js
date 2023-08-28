const express = require('express')
const router = express.Router({mergeParams: true});
const Campground = require('../models/campground')
const catchAsync = require('../utils/CatchAsync')
const expressError = require('../utils/expressError')
const Review = require('../models/review');
const {isLoggedIn, isReviewAuthor} = require('../middleware')
const reviews = require('../controllers/reviews')


router.post('/', isLoggedIn, catchAsync(reviews.createReview))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router