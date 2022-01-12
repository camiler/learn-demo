const uuid = require('uuid')
const { get, TABLE_TODO } = require('./db')

const getDataById = (id, callback) => {
  get().query(`SELECT * FROM ${TABLE_TODO} WHERE id=${id}`, (err, result) => {
    if (err) throw err
    callback(result)
  })
}
module.exports.add = async (data, callback) => {
  const time = new Date()
  const values = [data.title, data.description || '', data.creator || '', time]
  get().query(`INSERT INTO ${TABLE_TODO} (title, description, creator, createTime) VALUES(?, ?, ?, ?)`, values, (err, docs) => {
    if (err) throw err
    getDataById(docs.insertId, callback)
  })
}

module.exports.update = async (data, callback) => {
  const setArr = []
  for (let key in data) {
    if (data[key] && key !== 'id') {
      setArr.push(`${key}='${data[key]}'`)
    }
  }
  const setStr = setArr.join(', ')
  get().query(`UPDATE ${TABLE_TODO} SET ${setStr} WHERE id=${data.id}`, (err, docs) => {
    if (err) throw err
    getDataById(data.id, callback)
  })
}

module.exports.remove = async (id, callback) => {
  get().query(`DELETE FROM ${TABLE_TODO} WHERE id=${id}`, (err, docs) => {
    if (err) throw err
    callback(docs.affectedRows === 1)
  })
}

module.exports.getList = async (params, callback) => {
  const { pageNo = 1, pageSize = 10, status, keyword } = params
  let queryStr = ''
  if (keyword) {
    queryStr = ` WHERE title LIKE '%${keyword}%' OR description LIKE '%${keyword}%'`
  }
  if (status) {
    if (queryStr) {
      queryStr = `${queryStr} AND status=${status}`
    } else {
      queryStr = ` WHERE status=${status}`
    }
  }
  const limitMin = pageSize * (pageNo - 1)
  const limitMax = pageSize * pageNo
  get().query(`SELECT SQL_CALC_FOUND_ROWS * FROM ${TABLE_TODO}${queryStr} ORDER BY updateTime LIMIT ${limitMin},${limitMax}`, (err, docs) => {
    if (err) throw err
    get().query('SELECT FOUND_ROWS()', (err, count) => {
      if (err) throw err
      callback({
        pageSize,
        pageNo,
        total: count[0]['FOUND_ROWS()'],
        record: docs
      })
    })
  })
}