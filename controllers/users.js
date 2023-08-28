const User = require('../models/user')

module.exports.registerForm = (req, res) => {
    res.render('user/register')
}

module.exports.register = async(req, res, next)=>{
    const { username, email, password } = req.body
    const user = new User({username: username, email: email});
    const registeredUser = await User.register(user, password);
    
    req.login(registeredUser, err=>{
        if(err) return next(err)
        req.flash('success', 'Welcome to yelp camp!')
        res.redirect('/campgrounds')
    })

}

module.exports.loginForm = (req, res) => {
    res.render('user/login')
}

module.exports.login =  (req, res)=>{
    req.flash('success', 'Welcome back!')
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    delete res.locals.returnTo
    res.redirect(redirectUrl)
}

module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}