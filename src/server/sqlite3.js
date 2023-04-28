const path = require('path')
const sqlite3 = require('sqlite3').verbose()
const dbFile =
  process.env.NODE_ENV === 'development'
    ? path.join(__dirname, './moonman.db')
    : path.join(process.resourcesPath, './moonman.db')
const db = new sqlite3.Database(dbFile)

db.serialize(() => {
  db.run(
    'CREATE TABLE IF NOT EXISTS session (' +
      'id Integer PRIMARY KEY AUTOINCREMENT,' +
      'ip VARCHAR(255) NOT NULL DEFAULT "",' +
      'port Integer NOT NULL DEFAULT 80,' +
      'state Integer NOT NULL DEFAULT 0,' +
      'delimiter VARCHAR(255) NOT NULL DEFAULT "",' +
      'message_type VARCHAR(20) NOT NULL DEFAULT "",' +
      'create_time DATETIME,' +
      'update_time DATETIME' +
      ')'
  )
  db.run(
    'CREATE TABLE IF NOT EXISTS message (' +
      'id Integer PRIMARY KEY AUTOINCREMENT,' +
      'session_id Integer NOT NULL,' +
      'type Integer NOT NULL DEFAULT 0,' +
      'state Integer NOT NULL DEFAULT 0,' +
      'content TEXT,' +
      'create_time DATETIME,' +
      'update_time DATETIME' +
      ')'
  )
})

export function save(tableName, data) {
  let fieldArray = []
  let valueArray = []
  for (let key in data) {
    let value = data[key]
    if (typeof value === 'string') {
      value = `'${value}'`
    }
    fieldArray.push(key)
    valueArray.push(value)
  }
  let fields = '(' + fieldArray.join(',') + ')'
  let values = '(' + valueArray.join(',') + ')'
  let sql = `INSERT INTO ${tableName} ${fields} VALUES ${values}`
  return new Promise((resolve, reject) => {
    db.run(sql, function (err) {
      if (err != null) {
        reject(err)
      } else {
        resolve(this.lastID)
      }
    })
  })
}

export function updateById(tableName, id, data) {
  let fieldArray = []
  for (let key in data) {
    let value = data[key]
    if (typeof value === 'string') {
      value = `'${value}'`
    }
    fieldArray.push(`${key} = ${value}`)
  }
  let fields = fieldArray.join(',')
  let sql = `UPDATE ${tableName} SET ${fields} WHERE id = ${id}`
  return new Promise((resolve, reject) => {
    db.run(sql, function (err) {
      if (err != null) {
        reject(err)
      } else {
        resolve(this.lastID)
      }
    })
  })
}

export function list(tableName, where, orderBy) {
  let sql = `SELECT * FROM ${tableName}`
  if (where) {
    let whereArray = []
    for (let item of where) {
      if (!(item instanceof Array)) continue
      if (item.length === 2) {
        let field = item[0]
        let value = item[1]
        if (typeof value === 'string') {
          value = `'${value}'`
        }
        whereArray.push(`${field} = ${value}`)
      } else if (item.length === 3) {
        let field = item[0]
        let symbol = item[1]
        let value = item[2]
        if (typeof value === 'string') {
          value = `'${value}'`
        }
        whereArray.push(`${field} ${symbol} ${value}`)
      }
    }
    if (whereArray.length > 0) {
      let where = whereArray.join(' AND ')
      sql = `${sql} WHERE ${where}`
    }
  }
  if (orderBy) {
    sql = `${sql} ORDER BY ${orderBy}`
  }
  return new Promise((resolve, reject) => {
    db.all(sql, (err, rows) => {
      if (err != null) {
        reject(err)
      } else {
        resolve(rows)
      }
    })
  })
}

export function getOne(tableName, where) {
  let sql = `SELECT * FROM ${tableName}`
  if (where) {
    let whereArray = []
    for (let item of where) {
      if (!(item instanceof Array)) continue
      if (item.length === 2) {
        let field = item[0]
        let value = item[1]
        if (typeof value === 'string') {
          value = `'${value}'`
        }
        whereArray.push(`${field} = ${value}`)
      } else if (item.length === 3) {
        let field = item[0]
        let symbol = item[1]
        let value = item[2]
        if (typeof value === 'string') {
          value = `'${value}'`
        }
        whereArray.push(`${field} ${symbol} ${value}`)
      }
    }
    if (whereArray.length > 0) {
      let where = whereArray.join(' AND ')
      sql = `${sql} WHERE ${where}`
    }
  }
  return new Promise((resolve, reject) => {
    db.get(sql, (err, row) => {
      if (err != null) {
        reject(err)
      } else {
        resolve(row)
      }
    })
  })
}

export default db
