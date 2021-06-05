const express = require('express')
const multer = require('multer')
const path = require('path')
const crypto = require('crypto')
const GridFsStorage = require('multer-gridfs-storage')
require('./db/connect')
const upload = require('./model/upload')
const mongoose = require('mongoose')
const { Grid } = require('gridfs-stream')
const app = express()


app.use(express.json()) 
app.use(express.urlencoded({ extended: true }))

const port = process.env.PORT || 3000

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


const conn = mongoose.createConnection(process.env.MONGODB_URL)
let gfs;
conn.on('open', () => {
    gfs = Grid(conn.db, mongoose.mongo)
    gfs.collection('thumbnail')
})
const storage = new GridFsStorage({
    url: process.env.MONGODB_URL,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err)
                }
                const filename = buf.toString('hex') + path.extname(file.originalname)
                const fileinfo = {
                    filename: filename,
                    bucketname: 'uploads'
                }
                resolve(fileinfo)
            })
        })
    }
})

const uploadThubnail = multer({ storage });
app.post('/uploadthumb', uploadThubnail.single('thumbnail'), (req, res) => {
    res.json({thumbnail: req.thumbnail})
})
//upload video thumbnail to mongodb using multer
app.post('/uploadvideo', (req, res) => {
    res.send('upload video api')
})
// app.use(errorController)

app.listen(port, ()=>console.log(`server started at: http://localhost:${port}`))