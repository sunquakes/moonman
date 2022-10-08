import { server as WebSocketServer } from 'websocket'
let http = require('http')

// const sqlite3 = require('sqlite3').verbose()
// const db = new sqlite3.Database('../db/rpcman.db')

// db.serialize(() => {
//   db.run('CREATE TABLE lorem (info TEXT)')

//   const stmt = db.prepare('INSERT INTO lorem VALUES (?)')
//   for (let i = 0; i < 10; i++) {
//     stmt.run('Ipsum ' + i)
//   }
//   stmt.finalize()

//   db.each('SELECT rowid AS id, info FROM lorem', (err, row) => {
//     console.log(err)
//     console.log(row.id + ': ' + row.info)
//   })
// })

// db.close()

console.log('test666', http)

let server = http.createServer(function (request, response) {
  console.log(new Date() + ' Received request for ' + request.url)
  response.writeHead(404)
  response.end()
})

server.listen(8080, function () {
  console.log(new Date() + ' Server is listening on port 8080')
})

let wsServer = new WebSocketServer({
  httpServer: server,
  // You should not use autoAcceptConnections for production
  // applications, as it defeats all standard cross-origin protection
  // facilities built into the protocol and the browser.  You should
  // *always* verify the connection's origin and decide whether or not
  // to accept it.
  autoAcceptConnections: false
})

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true
}

wsServer.on('request', function (request) {
  if (!originIsAllowed(request.origin)) {
    // Make sure we only accept requests from an allowed origin
    request.reject()
    console.log(
      new Date() + ' Connection from origin ' + request.origin + ' rejected.'
    )
    return
  }

  var connection = request.accept('echo-protocol', request.origin)
  console.log(new Date() + ' Connection accepted.')
  connection.on('message', function (message) {
    if (message.type === 'utf8') {
      console.log('Received Message: ' + message.utf8Data)
      connection.sendUTF(message.utf8Data)
    } else if (message.type === 'binary') {
      console.log(
        'Received Binary Message of ' + message.binaryData.length + ' bytes'
      )
      connection.sendBytes(message.binaryData)
    }
  })
  connection.on('close', function (reasonCode, description) {
    console.log(
      new Date() + ' Peer ' + connection.remoteAddress + ' disconnected.'
    )
  })
})

export default wsServer
