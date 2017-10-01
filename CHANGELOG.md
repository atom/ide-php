## v0.6.9

- Fix PHP version detection on some systems where stdout delayed
- Address possible async issues in install that resulted in console warnings

## v0.6.8

- Setting for PHP path now points to the PHP binary itself not the folder

## v0.6.7

- Update to 4.6.1 of https://github.com/felixfbecker/php-language-server to fix memory leak
- Checks installed PHP runtime version is 7 or later
- Further improvements to error reporting

## v0.6.6

- Do not display an error dialog when shutting down the language server

## v0.6.5

- Default memory limit to 2GB to avoid issues on 32-bit systems

## v0.6.4

- Allow setting of the memory limit
- Improve error reporting
- Fix description of connection type setting

## v0.6.3

- Allow connection type to be configured in settings
- Deeper error logging via atom-languageclient - enable with atom.config.set('core.debugLSP', true)

## v0.6.2

- Add memory limit setting to work around language server issue on 32-bit systems (set it to 2G)
- Repackage language server to avoid issues with symlinks
