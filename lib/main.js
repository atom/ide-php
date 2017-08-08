const cp = require('child_process')
const net = require('net')
const path = require('path')
const {shell} = require('electron')
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
    const command = this.getPHPCommand()
    const args = [ path.join('felixfbecker', 'language-server', 'bin', 'php-language-server.php') ]
    if (extraArgs) {
      args.push(extraArgs)
    }
    this.logger.debug(`starting "${command} ${args.join(' ')}"`)
    const childProcess = cp.spawn(command, args, { cwd: path.join(__dirname, '..', 'vendor') })
    childProcess.on('error', err =>
      atom.notifications.addError('Unable to start the PHP language server.', {
        dismissable: true,
        buttons: [
          { text: 'Download PHP 7', onDidClick: () => shell.openExternal('https://secure.php.net/downloads.php') },
          { text: 'Set PHP Path', onDidClick: () => atom.workspace.open("atom://config/packages/ide-php") },
          { text: 'Open Dev Tools', onDidClick: () => atom.openDevTools() }
        ],
        description: 'This can occur if you do not have PHP 7 or later installed or it can not be found.'
      })
    )
    return childProcess
  }

  getPHPCommand () {
    const phpPath = this.getPHPPath()
    return phpPath == null ? 'php' : path.join(phpPath, 'php')
  }

  getPHPPath () {
    return (new Array(
      atom.config.get('ide-php.phpPath'),
      process.env['PHP_HOME'])
    ).find(j => j)
  }
}

module.exports = new PHPLanguageClient()
