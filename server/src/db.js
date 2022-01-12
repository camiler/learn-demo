// const mysqlx = require('@mysql/xdevapi')
const mysql = require('mysql')

const DB_NAME = 'learn'
const TABLE_TODO = 'TODO'

let session = null
exports.DB_NAME = DB_NAME
exports.TABLE_TODO = TABLE_TODO

const config = {
  host: 'localhost',
  user: 'root',
  password: '12345678',
  port: 33060,
  schema: DB_NAME
}

exports.connect = (done) => {
  // mysqlx的连接方式
  // mysqlx.getSession(config).then(res => {
  //   console.log('mysql db:learn todo connnected to', res.inspect().host)
  //   session = res
  //   done()
  // })

  // mysql包的连接方式
  config.database = config.schema
  config.port = 3306
  delete config.schema;
  session = mysql.createConnection(config)
  session.connect((err) => {
    if (err) throw err
    console.log('mysql db:learn todo connnected')
    done()
  })
}

exports.get = () => {
  return session
}