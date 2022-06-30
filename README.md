# fable-css-modules

Generate Fable bindings for your CSS modules classes

Allowing you to leverage CSS modules in your Fable projects, in a **safe way**.

```fs
module Components.QRCode

open Fable.Core.JsInterop
open Feliz

// Import the CSS module
let private classes : CssModules.Components.QRCode = import "default" "./QRCode.module.scss"

[<ReactComponent>]
let QRCode () =
    Html.div [
        prop.className classes.qrCode // Here you get completion of the defined CSS classes
        prop.children [
            // ..
        ]
    ]
```

## Prelude

**fable-css-module** can be used with **any bundler** (Vite, Webpack, etc.) that supports CSS modules and **any framework** (React, Vue, etc.).

This tools supports:

- CSS modules identified by `*.module.scss`
- SASS/SCSS modules identified by `*.module.sass` or `*.module.scss`

## Usage

```shell
fcm

Generate bindings for all the CSS modules in <source> folder to <outFile> file

Positionals:
  source  Folder where the CSS modules are located       [string] [default: "."]

Options:
      --version   Show version number                                  [boolean]
      --outFile   Output file where the binding will be written
                                             [string] [default: "CssModules.fs"]
      --internal  Mark the generated module as internal[boolean] [default: true]
  -h, --help      Show help                                            [boolean]
```

Example:

```
src
└─── Components
    │    QRCode.fs
    │    QRCode.module.scss
    └─── User
            History.fs
            History.module.scss
```

If you invoke `npx fcm` in the `src` folder, a file `src/CssModules.fs` will be generated with the following content:

```fs
//-----------------------------------------------------------------------------
//        This code was generated by fable-css-modules.
//        Changes to this file will be lost when the code is regenerated.
//-----------------------------------------------------------------------------

[<RequireQualifiedAccess>]
module internal CssModules

open Fable.Core

module Components =

    type QRCode =

        /// <summary>
        /// Binding for <c>qr-code</c> class
        /// </summary>
        [<Emit("$0[\"qr-code\"]")>]
        abstract qrCode : string

    module User =

        type History =

            /// <summary>
            /// Binding for <c>history-container</c> class
            /// </summary>
            [<Emit("$0[\"history-container\"]")>]
            abstract history-container : string
```

You should now add `<Compile Include="CssModules.fs" />` to your fsproj file.

You can now use the `CssModules` module in your Fable code.

*src/Components/QRCode.fs*

```fs
module Components.QRCode

open Fable.Core.JsInterop
open Feliz

let private classes : CssModules.Components.QRCode = import "default" "./QRCode.module.scss"

[<ReactComponent>]
let QRCode () =
    Html.div [
        prop.className classes.qrCode
        prop.children [
            // ..
        ]
    ]
```

## Best practices

You should avoid committing the generated files to your repository. This will force you to run `fable-css-modules` every time you want to build your project.

This help make sure that your CSS modules bindings is up to date with the actual CSS modules.

## Watch mode

Watch mode is not yet supported out of this box by fable-css-modules.

But you can easily add using [nodemon](https://nodemon.io/).

```shell
npx nodemon -e module.scss --exec "fcm"
```

This command will automatically run `fcm` every time a change to a `.module.scss` file is detected.

## IDE tips

It can happen that IDEs takes a moment to reflect the changes in the generated file.

Here are a few tips to help force them to update their references.

### Ionide

Navigating to the `CssModules.fs` file seems to make it refresh the file.

You can navigate to it by `Ctrl+Click` on the reference.

If this is not enough, you can try to add a space to the file and saving it manually.

*Remember, `CssModules.fs` should not be commited so adding non meaningful spaces don't really matter*

### Rider

You can click to `File > Reload All from Disk` or press `Ctrl+Alt+Y`
