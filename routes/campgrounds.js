const express = require('express')
const router = express.Router();
const Campground = require('../models/campground')
const catchAsync = require('../utils/CatchAsync')
const expressError = require('../utils/expressError')
const flash = require('connect-flash')
const {isLoggedIn, isAuthor} = require('../middleware')
const campgrounds = require('../controllers/campgrounds')
const multer = require('multer')
const {storage} = require('../cloudinary')
const upload = multer({ storage })


router.get('/', catchAsync(campgrounds.index))

router.get('/new', isLoggedIn , campgrounds.newForm)

router.post('/', isLoggedIn, upload.array('image'), catchAsync(campgrounds.create))

router.get('/:id', catchAsync(campgrounds.show))

router.get('/:id/edit', isLoggedIn, isAuthor,  catchAsync(campgrounds.editForm))

router.put('/:id', isLoggedIn, isAuthor, upload.array('image'), catchAsync(campgrounds.update))

router.delete('/:id', isLoggedIn, isAuthor,  catchAsync(campgrounds.delete))

module.exports = router