# TypeScript Interface Sorter

## Features

This extension allows you to sort properties of TypeScript interface.

![before command](./images/demo_before.png "Before sorting interface")

![find command](./images/demo_command_menu.png "Find sort command")

![after command](./images/demo_after.png "After sorting interface")

## Extension Settings

This extension contributes the following settings:

- `tsInterfaceSorter.emptyLineBetweenProperties`: Controls whether an empty line should be inserted between properties.
- `tsInterfaceSorter.sortByCapitalLetterFirst`: Controls whether properties started with capital letters should be sorted first separately before lower case ones.
- `tsInterfaceSorter.sortByRequiredElementFirst`: Controls whether required property should be sorted first. If turned on, takes precedence over `sortByCapitalLetterFirst` option.
- `tsInterfaceSorter.sortTypes`: When on, sort `type` as well as `interface`.
