const express = require('express');
const BusBoy = require('busboy');
const fs = require('fs');


// const NOT_FOUND = require('../constants/response-codes.js');
const NOT_FOUND = 404

const fakeUploadRouter = express.Router()


var transfer = ( str ) => {
    console.log( 'no res to receive' )
}

var transferToEnd = () => {}

var cancelUploadControll = () => {}

fakeUploadRouter.post('/progress', ( req, res ) => {
  res.write('0 ')
  transfer = ( str ) => {
    res.write( str )
  }
  transferToEnd = () => {
    res.end()
  }
})

fakeUploadRouter.post('/', (req, res) => {
  // A **really** terrible fake upload by using busboy to track incoming files so
  // there is some sort of progress available in the client. Don't actually do
  // anything with the files though.
  const busboy = new BusBoy({ headers: req.headers });
  busboy.on('finish', () => {
    transferToEnd();
    res.end();
  });
  cancelUploadControll = ( res ) => {
    res.end()
  }

  // 监听文件解析事件
  busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
    console.log(`File [${fieldname}]: filename: ${filename}`)
    
    // 文件保存到特定路径
    file.pipe(fs.createWriteStream('../upload'))
  
    // 开始解析文件流
    file.on('data', function(data) {
      console.log(`File [${fieldname}] got ${data.length} bytes`)
      transfer( `${data.length} ` )
    })
  
    // 解析文件结束
    file.on('end', function() {
      console.log(`File [${fieldname}] Finished`)
    })
  })
  req.pipe(busboy);
});


fakeUploadRouter.post('/cancelUpload', ( req, res ) => {
  cancelUploadControll()
  res.end()
})

fakeUploadRouter.use('*', (req, res) => {
  res.sendStatus(NOT_FOUND);
});

module.exports = fakeUploadRouter;