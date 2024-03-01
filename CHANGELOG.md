# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

## 1.5.0 - 2024-02-01

### Fixed

* [GH-2](https://github.com/MangelMaxime/fable-css-modules/issues/2) Support files with a `.` in their module name

## 1.4.1 - 2022-06-30

### Removed

* Remove debug log

## 1.4.0 - 2022-06-30

### Fixed

* Fix glob pattern to capture `css`, `scss` and `sass` files.
* Try fix again the "skip mechanism", sometimes it was removing a module that should not be removed.

### Added

* Add a log in case no classes are found.

## 1.3.1 - 2022-06-29

### Fixed

* Fix bug when providing the positional argument. The "skip mechanism" was not working properly.

## 1.3.0 - 2022-06-29

### Added

* Add message when the generation is done.
* Generate nothing if no CSS modules are found.

## 1.2.0 - 2022-06-29

### Fixed

* Make the positional arguments optional. Before we couldn't provide a value to it, it would crash the CLI saying `Unkown argument: XXX`
* Better normalize the `source` and `destinationFile`.

    This help fix the "skip mechanism" of the `source` segment path from the generated `modules`

## 1.1.0 - 2022-06-29

### Changed

* Change from `XXX.YYY.ModuleName.Classes` to `XXX.YYY.ModuleName`

    This makes the module path a bit less verbose.

* Mark `CssModules` as `[<RequireQualifiedAccess>]`.

    This will the simplification of module path, should make less verbose to access the classes and be still explicit enough.

## 1.0.0 - 2022-06-29

### Added

* Initial release
