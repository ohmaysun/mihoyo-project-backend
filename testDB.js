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
let res = []
// let getData = new Promise((resolve, reject) => {
//   // 条件查询
//   db.query('select * from img_tb where status > 0', [], (result, fields) => {
//     let dataString = JSON.stringify(result)
//     res = JSON.parse(dataString)
//     resolve(res)
//   })
// })

// getData.then(data => {
//   console.log(data)
// })

// // 查询实例
db.query('select * from img_tb where status=1', [], (result, fields) => {
    console.log('查询结果：')
    console.log(result)
    // json化
    let dataString = JSON.stringify(result)
    let data = JSON.parse(dataString)
    console.log(data)
    res = data
    console.log(res)
})
console.log(res)

//添加实例
// let addSql = 'INSERT INTO img_tb (`img_url`,`sort`,`status`, `upload_date`, `last_op_date`) VALUES ?'
// let opTimeStr = new Date(Date.now()).toJSON()
// let addSqlParams =[
//   ['222-1609314069967.jpeg','3',1,opTimeStr,opTimeStr],
//   ['222-1609314069967.jpeg','3',1,opTimeStr,opTimeStr]
//  ]
// db.query(addSql, [addSqlParams], (result, fields) => {
//     console.log('添加成功')
// })

//修改实例
// ( `sort`, `status`, `last_op_date`)
// let updateSql = 'UPDATE img_tb SET status = ?, upload_date = ? where img_id = ?'
// // let item = {
// //   img_id: 202012300023,
// //   img_url: "http://81.68.89.17:8972/images/test-1610636239185.jpeg",
// //   last_op_date: "2021-01-14T14:57:19.186Z",
// //   sort: "1",
// //   status: 0,
// //   upload_date: "2021-01-14T14:57:19.186Z"
// // }
// let opTimeStr = new Date(Date.now()).toJSON()
// let updateSqlParams = [1,opTimeStr,202012300024]
// db.query(updateSql, updateSqlParams, (result, fields) => {
//     console.log('修改成功')
// })

//删除实例
// let updateSql = 'DELETE from img_tb where img_id = ?'
// let item = {
//   img_id: 202012300023,
//   img_url: "http://81.68.89.17:8972/images/test-1610636239185.jpeg",
//   last_op_date: "2021-01-14T14:57:19.186Z",
//   sort: "1",
//   status: 0,
//   upload_date: "2021-01-14T14:57:19.186Z"
// }
// db.query(updateSql, [item.img_id], (result, fields) => {
//     console.log('删除成功')
// })