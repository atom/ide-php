const cp = require('child_process')
const fs = require('fs')
const net = require('net')
const path = require('path')
const rpc = require('vscode-jsonrpc')
const {AutoLanguageClient} = require('atom-languageclient')

class PHPLanguageServer extends AutoLanguageClient {
  getGrammarScopes () { return ['text.html.php'] }
  getLanguageName () { return 'PHP' }
  getServerName () { return 'FelixFBecker' }

  startServerProcess () {
    const serverHome = path.join(__dirname, '..', 'server')
    const command = 'php'
    const args = [path.join('felixfbecker', 'language-server', 'bin', 'php-language-server.php')]
    let childProcess

    return new Promise((resolve, reject) => {
      if (process.platform === 'win32') {
        // According to the PHP Language Server author stdin/stdout is blocking on Win so use sockets
        const server = net.createServer(socket => {
          server.close()
          this.socket = socket
          resolve(childProcess)
        })
        server.listen(0, '127.0.0.1', () => {
          args.push(`--tcp=127.0.0.1:${server.address().port}`)
          childProcess = this.spawnServer(command, args, serverHome)
        })
      } else {
        resolve(this.spawnServer(command, args, serverHome))
      }
    })
  }

  spawnServer (command, args, cwd) {
    this.logger.debug(`starting "${command} ${args.join(' ')}"`)
    return cp.spawn(command, args, { cwd: cwd })
  }

  createServerConnection () {
    return rpc.createMessageConnection(
      new rpc.SocketMessageReader(this.socket),
      new rpc.SocketMessageWriter(this.socket)
    )
  }
}

module.exports = new PHPLanguageServer()
