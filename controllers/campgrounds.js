const campground = require('../models/campground')
const Campground = require('../models/campground')
const flash = require('connect-flash')
const {cloudinary} = require('../cloudinary')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken})


module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', {campgrounds})
}

module.exports.newForm = (req, res)=>{
    res.render('campgrounds/new')
}

module.exports.create = async (req, res, next)=>{
    const geoData = await geocoder.forwardGeocode({
        query: req.body.location,
        limit: 1
    }).send()
    const {name, location, image, price, description} = req.body
    const campground = new Campground({title: name, location: location, image: image, price: price, description: description})
    campground.geometry = geoData.body.features[0].geometry;
    campground.author = req.user._id;
    campground.images = req.files.map(f => ({url: f.path, filename: f.filename}))
    await campground.save()
    console.log(campground)
    req.flash('success', 'Successfully made a new campground')
    res.redirect('/campgrounds')
}

module.exports.show =  async (req, res) =>{
    const campground = await Campground.findById(req.params.id).populate({path: 'reviews', populate: {path: 'author'}}).populate('author')
    if(!campground){
        req.flash('error', 'Cannot find the campground')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', {campground, msg: req.flash('success')})
}

module.exports.editForm =  async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    if(!campground){
        req.flash('error', 'Cannot find the campground')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', {campground})
}

module.exports.update =  async(req, res)=>{

    
    let updatedCampground = await Campground.findByIdAndUpdate(req.params.id, {title: `${req.body.name}`, location: `${req.body.location}`, price: `${req.body.price}`, description: `${req.body.description}`}, {new:true})
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}))
    // console.log(updatedCampground, '\n',imgs)
    updatedCampground.images.push(...imgs)
    // console.log(updatedCampground)
    await updatedCampground.save()
    // console.log(req.body.deleteImages)
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename)
            updatedCampground.images.splice(updatedCampground.images.findIndex(a => a.filename === filename), 1)
        }
        // console.log(updatedCampground)
        await updatedCampground.save()
    }
    req.flash('success', 'successfully updated campground')
    res.redirect(`/campgrounds/${req.params.id}`)
}

module.exports.delete =  async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id)
    req.flash('success', 'successfully deleted campground')
    res.redirect('/campgrounds')
}