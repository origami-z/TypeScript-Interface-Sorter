# Change Log

All notable changes to the "ts-interface-sorter" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.1] - 2021-05-13

### Fixed

- `sortByRequiredElementFirst` setting does not do anything after updating.
- Remove redundant sort finishing message.

## [0.2.0] - 2021-05-13

### Added

- New option to control whether required property should be sorted first: `tsInterfaceSorter.sortByRequiredElementFirst`

## [0.1.0] - 2020-12-30

### Added

- Warning message added when no file found
- Use up-to-date settings when invoking the command
- Image of usage in README

### Changed

- Success message to show number of interface detected

## [0.0.4] - 2020-12-29

### Added

- Extension icon

### Fixed

- Initialization error due to missing dependency `typescript`
