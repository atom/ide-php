## v0.7.14

- Bump autocomplete provider model to 4.0.0 so `Class1::` etc. works

## v0.7.13

- Update atom-languageclient to 0.9.4 to allow autocomplete on `->` etc. thanks @pelallemant

## v0.7.12

- Update atom-languageclient to 0.9.3

## v0.7.11

- Language server updated to 5.4.0 which add pseudo-keywords like int, bool, strict_types to completion

## v0.7.10

- Added option to change AutoComplete suggestions pritority (thanks @martinfojtik)

## v0.7.9

- Update atom-languageclient to 0.9.2 which includes better autocomplete

## v0.7.8

- Language server updated to 5.3.7
- Now capable of running on PHP 7.0 again

## v0.7.7

- Now checks for minimum version of PHP 7.1 which is required by language server

## v0.7.6

- Language server updated to 5.3.6 which includes completion and DefinitionResolver fixes (thanks @vinkla)

## v0.7.5

- Language server updated to 5.2.0 which includes Signature Help and fixes (thanks @vinkla)
- Update atom-languageclient to 0.8.3 which includes autocomplete and other fixes

## v0.7.4

- Language server updated to 5.2.0 which includes Signature Help and fixes (thanks @vinkla)

## v0.7.3

- Repackage 5.1.0 language server without prefix (script issue on macOS)

## v0.7.2

- Fix download URL for 5.1.0 language server

## v0.7.1

- Update atom-languageclient to 0.7.0 which includes
  - Sorting autocomplete results
  - Snippet completion type items
  - Busy signals for startup and shutdown
- Fixes broken signals in prior v0.7.0 release

## v0.7.0

- Update PHP language server to 5.1.0

## v0.6.10

- Use busy signal instead of status bar for installation progress
- Composer script added to package.json for ease of preparing new builds
- Update README to remove references to beta

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
