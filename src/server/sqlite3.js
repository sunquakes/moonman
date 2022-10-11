const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('db/rpcman.db')

db.serialize(() => {
  db.run(
    'CREATE TABLE IF NOT EXISTS session (' +
      'id Integer PRIMARY KEY AUTOINCREMENT,' +
      'address VARCHAR(255) NOT NULL DEFAULT "",' +
      'state Integer NOT NULL DEFAULT 0,' +
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
  //   const stmt = db.prepare('INSERT INTO lorem VALUES (?)')
  //   for (let i = 0; i < 10; i++) {
  //     stmt.run('Ipsum ' + i)
  //   }
  //   stmt.finalize()

  //   db.each('SELECT rowid AS id, info FROM lorem', (err, row) => {
  //     console.log(err)
  //     console.log(row.id + ': ' + row.info)
  //   })
})

export default db
