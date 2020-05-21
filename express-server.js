const http = require("http")
const express = require('express')
const multer  = require('multer')
const cors = require("cors")

// SET STORAGE
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
})

const upload = multer({ storage: storage })


const app = express();

app.use(cors())

// // Настройка сервера Express
// const options = {
//     cert: fs.readFileSync('./sslcert/fullchain.pem'),
//     key: fs.readFileSync('./sslcert/privkey.pem')
// };

app.post('/uploadfile', upload.single('file'), (req, res, next) => {
    const file = req.file
    if (!file) {
        const error = new Error('Please upload a file')
        error.httpStatusCode = 400
        return next(error)
    }
    res.send(file)

})

const httpServer = http.createServer(app)
// const httpsServer = https.createServer(options, app)

httpServer.listen(8081)
// httpsServer.listen(8082)
