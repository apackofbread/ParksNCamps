const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path')
const campground = require('../models/campground')
const cities = require('./cities')
const { places, descriptors} = require('./seedHelpers')
const axios = require('axios');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser : true,
    useUnifiedTopology : true
})
    .then(() => {
        console.log('mongo Connection open')
    })
    .catch(err => {
        console.log('mongo error')
        console.log(err)
    });

const sample = array => array[Math.floor(Math.random()*array.length)];

let collection = []

// axios.get('https://api.unsplash.com/collections/483251/photos',{
//         params: {
//             client_id: '0m3AMW6lzTeHCbyVgCcFzxgSJomVLPX1lPmJTlDcab8',
//             per_page: 30
//         }
//     }).then(data => {
//         collection = data
//         seedDB().then()
//     })


const seedDB = async () => {
    await campground.deleteMany({});
    console.log(collection)
    for(let i=0; i<400; i++){
        const random1000 = Math.floor(Math.random()*1000);
        const random30 = Math.floor(Math.random()*30);
        const price = Math.floor(Math.random()*20) + 10
        const camp = new campground({
            author: '64dd5f4780d91e0ce96c0efb',
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            geometry: {
                type: 'Point',
                coordinates: [cities[random1000].longitude, cities[random1000].latitude]
            },
            images: [
                {
                  url: 'https://res.cloudinary.com/dyhu15j8a/image/upload/v1692827432/yelp-camp/opn7umqtnmn7xwqb9b38.jpg',
                  filename: 'yelp-camp/opn7umqtnmn7xwqb9b38'
                }
              ],
            price: price,
            description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aperiam minima suscipit molestiae fugiat quidem culpa maxime quaerat quas quasi dignissimos eveniet vitae provident magnam, harum laudantium impedit, dolores, laborum natus!'
        })
        await camp.save()
    }
}

seedDB().then()
