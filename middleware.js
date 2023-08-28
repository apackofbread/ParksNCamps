const Campground = require('./models/campground')
const Review = require('./models/review')

module.exports.isLoggedIn = (req, res, next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl
        req.flash('error', 'you must be signed in')
        return res.redirect('/login')
    }else{
        next()
    }
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.isAuthor = async(req, res, next)=>{
    const campground = await Campground.findById(req.params.id)
    if(!campground.author.equals(req.user._id)){
        req.flash('error', 'you are not the owner of this campground');
        return res.redirect(`/campgrounds/${req.params.id}`)
    }
    next()
}

module.exports.isReviewAuthor = async(req, res, next)=>{
    const review = await Review.findById(req.params.reviewId)
    if(!review.author.equals(req.user._id)){
        req.flash('error', 'you are not the owner of this review');
        return res.redirect(`/campgrounds/${req.params.id}`)
    }
    next()
}