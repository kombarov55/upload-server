const http = require("http")
const https = require("https")
const express = require("express")
const fs = require("fs")
const fileUpload = require("express-fileupload")
const cors = require("cors")
const bodyParser = require("body-parser")
const morgan = require("morgan")
const _ = require("lodash")
const multer = require("multer")

const app = express();
app.use(fileUpload({
    createParentPath: true
}))

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(morgan("dev"))

const storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, "public")
	},
	filename: function(req, file, cb) {
		cb(null, Date.now() + "-" + file.originalname)
	}
})

const upload = multer({storage: storage}).single("file")
app.post("/upload", (req, res) => {
	upload(req, res, err => {
		if (err instanceof multer.MulterError) {
			return res.status(500).json(err)
		} else if (err) {
			return res.status(500).json(err)
		}
		return res.status(200).send(req.file)
	})
})

// Настройка сервера Express
const options = {
    cert: fs.readFileSync('./sslcert/fullchain.pem'),
    key: fs.readFileSync('./sslcert/privkey.pem')
};

app.get("/", function(req, res) {
    res.send("hello world")
})

const httpServer = http.createServer(app)
const httpsServer = https.createServer(options, app)

httpServer.listen(8081)
httpsServer.listen(8082)
