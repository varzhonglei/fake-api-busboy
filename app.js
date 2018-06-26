const express = require('express')
const multer  = require('multer')
const fakeUploadRouter = require('./router/fake-upload-router')

const app = express()
const upload = multer({ dest: 'upload/' })


app.use(function(req, res, next) {
  console.log( ' option ' )
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
})

app.use('/upload', fakeUploadRouter)


app.listen(3036, function () {
  console.log('app is listening at port 3036')
})