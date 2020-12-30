/*
let mysql = require('mysql')
// 数据库信息
let connection = mysql.createConnection({
  host  : '81.68.89.17',
  user  : 'root',
  password : 'q745230865zcz.',
  database : 'sang'
})
let values = [
  ['222-1609314069967.jpeg','1',1,Date.now()+'',Date.now()+''],
  ['222-1609314069967.jpeg','1',1,Date.now()+'',Date.now()+'']
]

let sql = "INSERT INTO img_tb (`img_url`,`sort`,`status`, `upload_date`, `last_op_date`) VALUES ?";
connection.query(sql, [values], function (err, rows, fields) {
  if (err) {
    console.log('INSERT ERROR - ', err.message)
    return
  }
  console.log("INSERT SUCCESS")
})
*/

let db = require('./mysql/mysql.js')
// 查询实例
db.query('select * from img_tb', [], (result, fields) => {
    console.log('查询结果：')
    console.log(result)
})

//添加实例
let addSql = 'INSERT INTO img_tb (`img_url`,`sort`,`status`, `upload_date`, `last_op_date`) VALUES ?'
let opTimeStr = new Date(Date.now()).toJSON()
let addSqlParams =[
  ['222-1609314069967.jpeg','3',1,opTimeStr,opTimeStr],
  ['222-1609314069967.jpeg','3',1,opTimeStr,opTimeStr]
 ]
db.query(addSql, [addSqlParams], (result, fields) => {
    console.log('添加成功')
})