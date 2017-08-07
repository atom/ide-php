const cp = require('child_process')
const net = require('net')
const path = require('path')
const {AutoLanguageClient} = require('atom-languageclient')

class PHPLanguageClient extends AutoLanguageClient {
  getGrammarScopes () { return ['text.html.php'] }
  getLanguageName () { return 'PHP' }
  getServerName () { return 'FelixFBecker' }

  startServerProcess () {
    if (process.platform === 'win32') {
      // stdio is blocking on Windows so use sockets
      return this.spawnWithPortAndSocket()
    } else {
      return this.spawnServer()
    }
  }

  spawnWithPortAndSocket () {
    return new Promise((resolve, reject) => {
      let childProcess
      const server = net.createServer(socket => {
        // When the PHP Language Server connects, grab socket, stop listening and resolve
        this.socket = socket
        server.close()
        resolve(childProcess)
      })
      server.listen(0, '127.0.0.1', () => {
        // Once we have a port assigned spawn the PHP Language Server with the port
        childProcess = this.spawnServer([`--tcp=127.0.0.1:${server.address().port}`])
      })
    })
  }

  spawnServer (extraArgs) {
    const command = 'php'
    const args = [ path.join('felixfbecker', 'language-server', 'bin', 'php-language-server.php') ]
    if (extraArgs) {
      args.push(extraArgs)
    }
    this.logger.debug(`starting "${command} ${args.join(' ')}"`)
    return cp.spawn(command, args, { cwd: path.join(__dirname, '..', 'vendor') })
  }
}

module.exports = new PHPLanguageClient()
