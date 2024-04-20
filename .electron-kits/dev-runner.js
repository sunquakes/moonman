const { exec } = require('child_process')
const { createServer } = require('vite')

const runCommand = (command, name) => {
  const childProcess = exec(command)

  childProcess.stdout.on('data', (data) => {
    console.info(`[${name}]: ${data}`)
  })

  childProcess.stderr.on('data', (data) => {
    console.log(data)
    console.error(`[${name}]: ${data}`)
  })
}

;(async () => {
  const server = await createServer({
    root: __dirname + '/../',
    server: {
      port: 3232
    }
  })
  await server.listen()

  // Start electron.
  const electronCommand = 'cross-env NODE_ENV=development & electron .'
  runCommand(electronCommand, 'electron')
})()
