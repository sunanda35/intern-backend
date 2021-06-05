const mongoose = require('mongoose');
require('dotenv').config();

const movieApp = new mongoose.Schema({
    movie_name: {
        type: String,
        required: [true, 'Give a Movie Name, Please!'],
        unique: [true, 'This Movie is already registered']
    },
    release_date: {
        type: Date,
        required: [true, "Give Movie Release Date. Please!"]
    },
    language: {
        type: String,
        required: [true, 'Give Movie Language, Please!']
    },
    thumbnail: {
        type: String,
        required: [true, 'Upload Trailer Thumbnail. Please!']
    },
    video: {
        type: String,
        required: [true, 'Upload Video. Please!']
    }
},
{
    timestamps : true
})


const MovieApp = mongoose.model('movieApp', movieApp)
module.exports = MovieApp;