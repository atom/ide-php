# IDE-PHP package
[![macOS Build Status](https://travis-ci.org/atom/ide-php.svg?branch=master)](https://travis-ci.org/atom/ide-php) [![Windows Build Status](https://ci.appveyor.com/api/projects/status/99y003ssr76ovd17?svg=true)](https://ci.appveyor.com/project/Atom/ide-php/branch/master) [![Dependency Status](https://david-dm.org/atom/ide-php.svg)](https://david-dm.org/atom/ide-php)

PHP language support for Atom-IDE, powered by [FelixFBeckers PHP Language Server](https://github.com/felixfbecker/php-language-server).

![Screen shot of IDE-PHP](https://user-images.githubusercontent.com/118951/30307874-5a0b03d6-9736-11e7-84d1-55eafe784cda.png)

## Early access

This package is currently an early access release.  You should also install the [atom-ide-ui](https://atom.io/packages/atom-ide-ui) package to expose the functionality within Atom.

## Using

You will need to clone this repo and make sure that you have the [PHP runtime v7](http://php.net/downloads.php) or later installed as well as the [PHP Composer](https://getcomposer.org/download/) dependency management tool - both should be in your path.

1. `apm i`
2. `composer install`

This will populate the 'vendor' folder with the actual PHP language server necessary for this package to work.

Release versions will look at bundling the vendor folder in order to make this easier to use.

## Contributing
Always feel free to help out!  Whether it's [filing bugs and feature requests](https://github.com/atom/languageserver-php/issues/new) or working on some of the [open issues](https://github.com/atom/languageserver-php/issues), Atom's [contributing guide](https://github.com/atom/atom/blob/master/CONTRIBUTING.md) will help get you started while the [guide for contributing to packages](https://github.com/atom/atom/blob/master/docs/contributing-to-packages.md) has some extra information.

## License
MIT License.  See [the license](LICENSE.md) for more details.
