let express = require('express')
let app = express()
let multer = require('multer')
let fs = require('fs')
let db = require('./mysql/mysql.js')

// 服务器的base_url
const BASE_URL = 'http://127.0.0.1:8000/'
// 上传图片的目录
let UPLOAD_FOLDER = './upload/'

// 创建文件夹
let createFolder = (folder) => {
  try{
  	fs.accessSync(folder)
  } catch (e) {
  	fs.mkdirSync(folder)
  }
}

// 创建文件夹
createFolder(UPLOAD_FOLDER)

// 通过 filename 属性定制
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_FOLDER) // 保存的路径，备注：需要自己创建
  },
  filename: (req, file, cb) => {
  	// console.log(file)
    // 将保存文件名设置为 原文件名 + 时间戳，比如 logo-1478521468943
    let suffix = file.mimetype.split('/')[1] //获取文件格式
    cb(null, file.originalname.split('.')[0] + '-' + Date.now()+'.'+suffix)
   }
})
 
// 通过 storage 选项来对 上传行为 进行定制化
let upload = multer({ storage: storage })

// 设置跨域
app.all('*', (req,res,next) => {
  //设置允许跨域的域名，*代表允许任意域名跨域
  res.header('Access-Control-Allow-Origin', '*')
  //允许的header类型
  res.header('Access-Control-Allow-Headers', 'content-type')
  //跨域允许的请求方式 
  res.header('Access-Control-Allow-Methods', 'DELETE,PUT,POST,GET,OPTIONS')
  if (req.method.toLowerCase() == 'options')
    res.send(200) // 让options尝试请求快速结束
  else
    next()
})

// /uploadImages路由的post方法，处理上传文件
app.post('/uploadImages', upload.array('files'), (req,res,next) => {
  //req.body contains the text fields
  // console.log(req.files)

  // 读取上传的图片信息
  let files = req.files

  // 设置返回结果
  if (!files) {
    res.send({code: 101, data: {msg: 'failed'}})
  } else {
    res.send({code: 200, data: {msg: 'success'}})
  }
  res.end()
})

// /getImages路由的get方法，返回upload目录下的所有文件。 这是v1最简单版，之后要通过数据库来操作。
app.get('/getImages', (req,res,next) => {
  const files = fs.readdirSync(UPLOAD_FOLDER)
  // console.log(files)
  if (!files) {
    res.send({code: 101, data: {msg: 'failed'}})
  } else {
  	let result = {
  	  msg: 'success',
      baseurl: BASE_URL,
  	  files: files
  	}
    res.send({code: 200, data: result})
  }
  res.end()
})


// 绑定端口号，启动服务器
app.listen(8000, () => {
	console.log('服务器启动成功，在', BASE_URL)
})