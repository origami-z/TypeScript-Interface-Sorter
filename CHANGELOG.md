# Change Log

All notable changes to the "ts-interface-sorter" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.5.0] - 2026-02-27

### Added

- New `useWorkspaceTypeScript` setting to use the TypeScript version from the workspace or the version selected in VS Code, allowing parsing of newer TypeScript syntax.

### Changed

- Upgraded project dependencies to modern versions.
- Updated GitHub Actions workflows to use Node 20 and latest action versions.

## [0.4.0] - 2023-10-31

- Indent space takes `editor.tabSize`` setting

## [0.3.1] - 2022-11-14

- Fix `emptyLineBetweenProperties` not working

## [0.3.0] - 2022-04-14

### Added

- `type` now can also be sorted on top of `interface`. Use `sortTypes` setting to turn it off.

### Changed

- Updated bundled `typescript` version to 4.6.3.

## [0.2.2] - 2022-04-12

### Security

- Bump various dependency package version for vulnerability

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
