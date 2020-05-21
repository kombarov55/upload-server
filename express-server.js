const http = require("http")
const https = require("https")
const express = require('express')
const multer  = require('multer')
const cors = require("cors")
const fs = require("fs")

// SET STORAGE
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
})

const upload = multer({ storage: storage })

const app = express();

app.use(cors())
app.use(express.static("public"))

app.post('/uploadfile', upload.single('file'), (req, res, next) => {
    const file = req.file
    if (!file) {
        const error = new Error('Please upload a file')
        error.httpStatusCode = 400
        return next(error)
    }
    res.send({filename: file.filename})

})

http.createServer(app).listen(8081)
https.createServer({
    cert: fs.readFileSync('./sslcert/fullchain.pem'),
    key: fs.readFileSync('./sslcert/privkey.pem')
}, app).listen(8082)
