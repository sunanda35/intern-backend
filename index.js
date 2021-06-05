const express = require('express')
const multer = require('multer')
const path = require('path')
const crypto = require('crypto')
var cors = require('cors')
const GridFsStorage = require('multer-gridfs-storage')
require('./db/connect')
const upload = require('./model/upload')
const mongoose = require('mongoose')
const { Grid } = require('gridfs-stream')
const app = express()
app.use(cors())

app.use(express.json()) 
app.use(express.urlencoded({ extended: true }))

const port = process.env.PORT || 6000
app.get('/', (req, res) => {
    res.send('Nothing is here bitch!')
})
app.get('/getall', async(req, res) => {
    await upload.find({}, (err, result) => {
        if (err) {
            res.status(400).send(err)
        }
        if (result) {
            res.status(200).send({
                status: 200,
                author: 'Sunanda Samanta',
                data: result
            })
        }
        
    })
})
// get all movie docs

app.post('/uploaddata', async(req, res) => {
    var movieName = req.body.movie_name;
    var releaseDate = req.body.release_date;
    var language = req.body.language;
    var thumbnail = req.body.thumbnail;
    var video = req.body.video;
    var formData = {
        "movie_name": movieName,
        "release_date": releaseDate,
        "language": language,
        "thumbnail": thumbnail,
        "video": video
    }

    try {
        const uploadData =  new upload(formData);
        var data = await uploadData.save();
        res.status(200).send({
            status: 200,
            message: "Successfully Movie Data Uploaded!"
        })
    } catch (err) {
        if (err.code===11000) {
            res.status(409).send({
                status: 409,
                message: 'This Movie is already Registered',
                error: err
            });
        } else {
            res.status(500).send({
                status: 500,
                message: err.message,
                error: err
            })
        }
    }
})
//upload all movie details to mongodb


app.listen(port, ()=>console.log(`server started at: http://localhost:${port}`))