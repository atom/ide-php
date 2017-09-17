const cp = require('child_process')
const fs = require('fs')
const net = require('net')
const path = require('path')
const {shell} = require('electron')
const {AutoLanguageClient, DownloadFile} = require('atom-languageclient')

const serverDownloadUrl = 'https://github.com/atom/ide-php/files/1301523/php-ls.4.6.0.tar.gz'
const serverDownloadSize = 4480244
const serverLauncher = path.join('felixfbecker', 'language-server', 'bin', 'php-language-server.php')

class PHPLanguageClient extends AutoLanguageClient {
  getGrammarScopes () { return [ 'text.html.php' ] }
  getLanguageName () { return 'PHP' }
  getServerName () { return 'FelixFBecker' }

  constructor () {
    super()
    this.statusElement = document.createElement('span')
    this.statusElement.className = 'inline-block'
  }

  getConnectionType() {
    const configConnectionType = atom.config.get('ide-php.connectionType')
    switch (configConnectionType) {
      case 'auto':    return process.platform === 'win32' ? 'socket' : 'stdio';
      case 'socket':  return 'socket';
      case 'stdio':   return 'stdio';
      default:
        atom.notifications.addWarning('Invalid connection type setting', {
          dismissable: true,
          buttons: [ { text: 'Set Connection Type', onDidClick: () => this.openPackageSettings() } ],
          description: 'The connection type setting should be set to "auto", "socket" or "stdio". "auto" is "socket" on Window and "stdio" on other platforms.'
        })
    }
  }

  startServerProcess () {
    const serverHome = path.join(__dirname, '..', 'vendor')

    return this.getOrInstallServer(serverHome).then(() =>
      this.getConnectionType() === 'socket' ? this.spawnServerWithSocket() : this.spawnServer()
    )
  }

  spawnServerWithSocket () {
    return new Promise((resolve, reject) => {
      let childProcess
      const server = net.createServer(socket => {
        // When the Language Server connects, grab socket, stop listening and resolve
        this.socket = socket
        server.close()
        resolve(childProcess)
      })
      server.listen(0, '127.0.0.1', () => {
        // Once we have a port assigned spawn the Language Server with the port
        childProcess = this.spawnServer([`--tcp=127.0.0.1:${server.address().port}`])
      })
    })
  }

  spawnServer (extraArgs) {
    const command = this.getPHPCommand()
    const serverHome = path.join(__dirname, '..', 'vendor')

    // Temporarily set the default to 2GB as language server defaults to 4GB which fails on 32-bit systems
    const memoryLimit = this.getMemoryLimit() === '-1' ? '2G' : this.getMemoryLimit()

    const args = [ serverLauncher, '--memory-limit=' + memoryLimit ]
    if (extraArgs) {
      args.push(extraArgs)
    }

    this.logger.debug(`starting "${command} ${args.join(' ')}"`)
    const childProcess = cp.spawn(command, args, { cwd: serverHome })
    childProcess.on('error', err =>
      atom.notifications.addError('PHP language server was unable to start.', {
        dismissable: true,
        buttons: [
          { text: 'Download PHP 7', onDidClick: () => shell.openExternal('https://secure.php.net/downloads.php') },
          { text: 'Set PHP Path', onDidClick: () => this.openPackageSettings() },
          { text: 'Open Dev Tools', onDidClick: () => atom.openDevTools() }
        ],
        description: 'This can occur if you do not have PHP 7 or later installed or it can not be found.'
      })
    )
    childProcess.stderr.on('data', (chunk) => this.lastError = chunk.toString())
    childProcess.on('exit', exitCode => {
      if (exitCode == 0 || exitCode == null) {
        this.updateStatusBar()
      } else {
        this.updateStatusBar('stopped')
        atom.notifications.addError('PHP language server stopped unexpectedly.', {
          dismissable: true,
          description: '<code>' + this.lastError + '</code>'
        })
      }
    })
    return childProcess
  }

  getPHPCommand () {
    const phpPath = this.getPHPPath()
    return phpPath == null ? 'php' : path.join(phpPath, 'php')
  }

  getMemoryLimit () {
    const memoryLimit = atom.config.get('ide-php.memoryLimit') || '-1'

    if (memoryLimit != '-1' && !/^\d+[KMG]?$/.test(memoryLimit)) {
      atom.notifications.addError(`Invalid memory limit setting of ${memoryLimit}`, {
        dismissable: true,
        buttons: [ { text: 'Set Memory Limit', onDidClick: () => this.openPackageSettings() } ],
        description: 'The memory limit setting should be set to -1, a numeric value or PHP shorthand notation such as 100M, 2G.'
      })
      return '-1'
    }

    return memoryLimit;
  }

  openPackageSettings() {
    atom.workspace.open("atom://config/packages/ide-php")
  }

  getPHPPath () {
    return (new Array(
      atom.config.get('ide-php.phpPath'),
      process.env['PHP_HOME'])
    ).find(j => j)
  }

  getOrInstallServer (serverHome) {
    return this.fileExists(path.join(serverHome, serverLauncher))
      .then(doesExist => { if (!doesExist) return this.installServer(serverHome) })
  }

  installServer (serverHome) {
    const localFileName = path.join(serverHome, 'download.tar.gz')
    const decompress = require('decompress')
    this.logger.log(`Downloading ${serverDownloadUrl} to ${localFileName}`);
    return this.fileExists(serverHome)
      .then(doesExist => { if (!doesExist) fs.mkdirSync(serverHome) })
      .then(() => DownloadFile(serverDownloadUrl, localFileName, (bytesDone, percent) => this.updateStatusBar(`downloading ${percent}%`), serverDownloadSize))
      .then(() => this.updateStatusBar('unpacking'))
      .then(() => decompress(localFileName, serverHome))
      .then(() => this.fileExists(path.join(serverHome, serverLauncher)))
      .then(doesExist => { if (!doesExist) throw Error(`Failed to install the ${this.getServerName()} language server`) })
      .then(() => this.updateStatusBar('installed'))
      .then(() => fs.unlinkSync(localFileName))
  }

  preInitialization(connection) {
    this.updateStatusBar('started')
  }

  updateStatusBar (text) {
    if (text == null || text === '') {
      this.statusElement.hidden = true
      this.statusElement.textContent = ''
    } else {
      this.statusElement.hidden = false
      this.statusElement.textContent = `${this.name} ${text}`
    }
  }

  consumeStatusBar (statusBar) {
    this.statusTile = statusBar.addRightTile({ item: this.statusElement, priority: 1000 })
  }

  fileExists (path) {
    return new Promise((resolve, reject) => {
      fs.access(path, fs.R_OK, error => {
        resolve(!error || error.code !== 'ENOENT')
      })
    })
  }

  deleteFileIfExists (path) {
    return new Promise((resolve, reject) => {
      fs.unlink(path, error => {
        if (error && error.code !== 'ENOENT') { reject(error) } else { resolve() }
      })
    })
  }
}

module.exports = new PHPLanguageClient()
