const path = require('path')
const sqlite3 = require('sqlite3').verbose()
const dbFile = path.join(process.resourcesPath || '', 'sqlite3.db')
let db

const getDb = () => {
  return new Promise((resolve) => {
    if (db !== undefined) {
      resolve(db)
    } else {
      db = new sqlite3.Database(dbFile, (err) => {
        if (err !== null) {
          db = new sqlite3.Database(':memory:')
          resolve(db)
        }
      })
      resolve(db)
    }
  })
}

export function execute(sql) {
  return getDb().then((db) => {
    return new Promise((resolve, reject) => {
      db.exec(sql, function (err) {
        if (err != null) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  })
}

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
  return getDb().then((db) => {
    return new Promise((resolve, reject) => {
      db.run(sql, function (err) {
        if (err != null) {
          reject(err)
        } else {
          resolve(this.lastID)
        }
      })
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
  return getDb().then((db) => {
    return new Promise((resolve, reject) => {
      db.run(sql, function (err) {
        if (err != null) {
          reject(err)
        } else {
          resolve(this.lastID)
        }
      })
    })
  })
}

export function list(tableName, where, orderBy, offset, limit) {
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
  if (offset !== undefined && limit !== undefined) {
    sql = `${sql} LIMIT ${offset}, ${limit}`
  }
  return getDb().then((db) => {
    return new Promise((resolve, reject) => {
      db.all(sql, (err, rows) => {
        if (err != null) {
          reject(err)
        } else {
          resolve(rows)
        }
      })
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
  return getDb().then((db) => {
    return new Promise((resolve, reject) => {
      db.get(sql, (err, row) => {
        if (err != null) {
          reject(err)
        } else {
          resolve(row)
        }
      })
    })
  })
}

export function remove(tableName, where) {
  let sql = `DELETE FROM ${tableName}`
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
  return getDb().then((db) => {
    return new Promise((resolve, reject) => {
      db.get(sql, (err, row) => {
        if (err != null) {
          reject(err)
        } else {
          resolve(row)
        }
      })
    })
  })
}
