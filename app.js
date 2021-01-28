let express = require('express')
let app = express()
let multer = require('multer')
let fs = require('fs')
let db = require('./mysql/mysql.js')

// 服务器的base_url
const BASE_URL = 'http://127.0.0.1:8000/'
// 图片服务器的img_base_url
const IMG_BASE_URL = 'http://81.68.89.17:8972/images/'
// 上传图片的目录
let UPLOAD_FOLDER = '/root/sjm/images/'

// 为req配置 处理req携带的参数
let bodyParser = require('body-parser')
//只要加入这个配置，在req请求对象上会多出来一个属性
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
//parse application/json
app.use(bodyParser.json())
// post请求携带的参数。如何获取？
// 1、url携带的参数：req.query   2、body里携带的参数req.body

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
// v1 只上传到图片目录
// v2 上传到图片目录和数据库

app.post('/uploadImages', upload.array('files'), (req,res,next) => {
  //req.body contains the text fields
  // console.log(req.files)

  // 读取上传的图片信息
  let files = req.files
  // 设置sql参数
  let addSql = 'INSERT INTO img_tb (`img_url`,`sort`,`status`, `upload_date`, `last_op_date`) VALUES ?'
  let opTimeStr = new Date(Date.now()).toJSON()
  // let addSqlParams =[
  //   ['222-1609314069967.jpeg','1',0,opTimeStr,opTimeStr],
  //   ['222-1609314069967.jpeg','1',0,opTimeStr,opTimeStr]
  // ]
  let addSqlParams = []
  files.forEach(item => {
    addSqlParams.push([item.filename, '1', 0, opTimeStr, opTimeStr])
  })
  let addData = new Promise((resolve, reject) => {
    db.query(addSql, [addSqlParams], (result, fields) => {
      console.log('添加成功')
      resolve(addSqlParams)
    })
  }).catch(err => {
    console.log(err)
    reject(err)
  })
  addData.then(files => {
    // 设置返回结果
    if (!files) {
      res.send({code: 101, data: {msg: 'failed'}})
      res.end()
    } else {
      res.send({code: 200, data: {msg: 'success'}})
      res.end()
    }
  }).catch(err => {
    res.send({code: 101, data: {msg: 'failed'}})
    res.end()
  })
})

// v1
// app.post('/uploadImages', upload.array('files'), (req,res,next) => {
//   //req.body contains the text fields
//   // console.log(req.files)

//   // 读取上传的图片信息
//   let files = req.files

//   // 设置返回结果
//   if (!files) {
//     res.send({code: 101, data: {msg: 'failed'}})
//   } else {
//     res.send({code: 200, data: {msg: 'success'}})
//   }
//   res.end()
// })

// /getImages路由的get方法，返回upload目录下的所有文件。 这是v1最简单版，之后要通过数据库来操作。
// v2 返回数据库的查询数据 利用promise保证先请求接口再返回数据。后续v3要按页返回数据
app.get('/getImages', (req,res,next) => {
  let files = []
  let getData = new Promise((resolve, reject) => {
    db.query('select * from img_tb', [], (result, fields) => {
      let dataString = JSON.stringify(result)
      files = JSON.parse(dataString)
      resolve(files)
    })
  }).catch(err => {
    console.log(err)
    reject(err)
  })
  getData.then(files => {
    if (!files) {
      res.send({code: 101, data: {msg: 'failed'}})
      res.end()
    } else {
      let result = {
        msg: 'success',
        baseurl: IMG_BASE_URL,
        files: files
      }
      res.send({code: 200, data: result})
      res.end()
    }
  }).catch(err => {
    res.send({code: 101, data: {msg: 'failed'}})
    res.end()
  })
})

// v1
// /getImages路由的get方法，返回upload目录下的所有文件。 这是v1最简单版，之后要通过数据库来操作。
// app.get('/getImages', (req,res,next) => {
//   let files = []
//   // 查询实例
//   db.query('select * from img_tb', [], (result, fields) => {
//     //console.log('数据库查询结果：')
//     //console.log(result)
//     // json化
//     let dataString = JSON.stringify(result)
//     files = JSON.parse(dataString)
//   })
//   //const files = fs.readdirSync(UPLOAD_FOLDER)
//   console.log(files)
//   if (!files) {
//     res.send({code: 101, data: {msg: 'failed'}})
//   } else {
//         let result = {
//           msg: 'success',
//           baseurl: BASE_URL,
//           files: files
//         }
//     res.send({code: 200, data: result})
//   }
//   res.end()
// })

// /delImageById 参数：id。 图片管理-删除某条记录接口
app.post('/delImageById', (req,res,next) => {
  // console.log(req)
  //这里我们需要使用一个第三方包 body-parser
  let params = req.body 
  // console.log(params) // { img_id: 202012300021 }
  let operation = new Promise((resolve, reject) => {
    let updateSql = 'DELETE from img_tb where img_id = ?'
    db.query(updateSql, [params.img_id], (result, fields) => {
      resolve(result)
    })
  }).catch(err => {
    console.log(err)
    reject(err)
  })
  operation.then(files => {
    // 设置返回结果
    if (!files) {
      res.send({code: 101, data: {msg: 'failed'}})
      res.end()
    } else {
      res.send({code: 200, data: {msg: 'success'}})
      res.end()
    }
  }).catch(err => {
    res.send({code: 101, data: {msg: 'failed'}})
    res.end()
  })
})

// /passImageById 参数：id。 图片管理-通过。status:0不可展示。status:1可展示。 要把status改为1
app.post('/passImageById', (req,res,next) => {
  // console.log(req)
  //这里我们需要使用一个第三方包 body-parser
  let params = req.body 
  // console.log(params) // { img_id: 202012300021 }
  let operation = new Promise((resolve, reject) => {
    let updateSql = 'UPDATE img_tb SET status = ?, upload_date = ? where img_id = ?'
    let opTimeStr = new Date(Date.now()).toJSON()
    let updateSqlParams = [1,opTimeStr,params.img_id]
    db.query(updateSql, updateSqlParams, (result, fields) => {
      resolve(result)
    })
  }).catch(err => {
    console.log(err)
    reject(err)
  })
  operation.then(files => {
    // 设置返回结果
    if (!files) {
      res.send({code: 101, data: {msg: 'failed'}})
      res.end()
    } else {
      res.send({code: 200, data: {msg: 'success'}})
      res.end()
    }
  }).catch(err => {
    res.send({code: 101, data: {msg: 'failed'}})
    res.end()
  })
})

// /rejectImageById 参数：id。 图片管理-拒绝。status:0不可展示。status:1可展示。 要把status改为0
app.post('/rejectImageById', (req,res,next) => {
  // console.log(req)
  //这里我们需要使用一个第三方包 body-parser
  let params = req.body 
  // console.log(params) // { img_id: 202012300021 }
  let operation = new Promise((resolve, reject) => {
    let updateSql = 'UPDATE img_tb SET status = ?, upload_date = ? where img_id = ?'
    let opTimeStr = new Date(Date.now()).toJSON()
    let updateSqlParams = [0,opTimeStr,params.img_id]
    db.query(updateSql, updateSqlParams, (result, fields) => {
      resolve(result)
    })
  }).catch(err => {
    console.log(err)
    reject(err)
  })
  operation.then(files => {
    // 设置返回结果
    if (!files) {
      res.send({code: 101, data: {msg: 'failed'}})
      res.end()
    } else {
      res.send({code: 200, data: {msg: 'success'}})
      res.end()
    }
  }).catch(err => {
    res.send({code: 101, data: {msg: 'failed'}})
    res.end()
  })
})

// /getShowImages路由的get方法 返回展示的图片，即审核通过的图片，status为1的数据。
// v2 返回数据库的查询数据 利用promise保证先请求接口再返回数据。后续v3要按页返回数据
app.get('/getShowImages', (req,res,next) => {
  let files = []
  let getData = new Promise((resolve, reject) => {
    db.query('select * from img_tb where status>0', [], (result, fields) => {
      let dataString = JSON.stringify(result)
      files = JSON.parse(dataString)
      resolve(files)
    })
  }).catch(err => {
    console.log(err)
    reject(err)
  })
  getData.then(files => {
    if (!files) {
      res.send({code: 101, data: {msg: 'failed'}})
      res.end()
    } else {
      let result = {
        msg: 'success',
        baseurl: IMG_BASE_URL,
        files: files
      }
      res.send({code: 200, data: result})
      res.end()
    }
  }).catch(err => {
    res.send({code: 101, data: {msg: 'failed'}})
    res.end()
  })
})

// 绑定端口号，启动服务器
app.listen(8000, () => {
	console.log('服务器启动成功，在', BASE_URL)
})
