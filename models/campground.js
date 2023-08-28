const mongoose = require('mongoose');
const schema = mongoose.Schema;
const Review = require('./review')

const imageSchema = new schema({
    url: String,
    filename: String
});

imageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload', '/upload/w_200')
});



const opts = { toJSON: {virtuals: true}};

const campgroundSchema = new schema({
    title: String,
    price: Number,
    description : String,
    location : String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    images : [imageSchema],
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, opts);

campgroundSchema.virtual('properties.popUpMarkup').get(function(){
    return `<b><a href='/campgrounds/${this._id}'>${this.title}</a></b>`
});

campgroundSchema.post('findOneAndDelete', async function(campground){
    if(campground){
        await Review.deleteMany({_id: {$in: campground.reviews}})
    }    
})

module.exports = mongoose.model('Campground', campgroundSchema);