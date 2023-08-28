if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path')
const methodOverride = require('method-override')
const engine = require('ejs-mate')
const expressError = require('./utils/expressError')
const session = require('express-session')
const MongoStore = require('connect-mongo');
const flash = require('connect-flash')
const mongoSanitize = require('express-mongo-sanitize')
const passport = require('passport')
const localStrategy = require('passport-local')
const helmet = require('helmet')
const User = require('./models/user')

const campgroundRoutes = require('./routes/campgrounds')
const reviewsRoutes = require('./routes/reviews')
const userRoutes = require('./routes/users')
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp'
const port = process.env.PORT || 3000


mongoose.connect(dbUrl, {
    useNewUrlParser : true,
    useUnifiedTopology : true
})
    .then(() => {
        console.log('mongo Connection open')
        app.listen(port, (req, res) => {
            console.log(`connection on port ${port}`)
        })
    })
    .catch(err => {
        console.log('mongo error')
        console.log(err)
    });

const secret = process.env.SECRET || 'thisshouldbeabettersecret!'

const store = MongoStore.create({
        mongoUrl: dbUrl,
        touchAfter: 24 * 60 * 60,
        crypto: {
            secret: secret
        }
    });

store.on('error', function(e){
    console.log('session store error', e)
})
 
app.engine('ejs', engine)

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))
app.use(mongoSanitize())
app.use(helmet({contentSecurityPolicy: false}))

app.use(express.static(path.join(__dirname, 'public')))

const sessionConfig = {
    store: store,
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7,
        httpOnly: true
    }
}
app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next)=>{
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error')
    next();
})


app.use('/', userRoutes)
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewsRoutes)





app.get('/', (req, res) => {
    res.render('home')
})




// app.all('*', (req, res, next)=>{
//     next(new expressError('Page Not Found', 404))
// })

app.use((err, req, res, next)=>{
    console.log(err)
    res.send(err)
    next()
})

