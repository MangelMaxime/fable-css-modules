import { expect, test } from 'vitest'
import { handler } from '../src/commands/build'
import { readFileSync } from "node:fs"

test('contains 1 class if there is one CSS Module', async () => {
    await handler({
        source: "fixtures/oneCssModule",
        outFile: 'fixtures/oneCssModule/CssModules.fs',
        internal: true,
        camelCase: false,
        _: [],
        $0: ''
    })

    const content = readFileSync("fixtures/oneCssModule/CssModules.fs").toString()
    expect(content).toMatchSnapshot()
})

test('contains 1 class per CSS Module', async () => {
    await handler({
        source: "fixtures/multipleCssModules",
        outFile: 'fixtures/multipleCssModules/CssModules.fs',
        internal: true,
        camelCase: false,
        _: [],
        $0: ''
    })

    const content = readFileSync("fixtures/multipleCssModules/CssModules.fs").toString()
    expect(content).toMatchSnapshot()
})

test('support CSS/SASS/SCSS modules', async () => {
    await handler({
        source: "fixtures/checkSupportedFormat",
        outFile: 'fixtures/checkSupportedFormat/CssModules.fs',
        internal: true,
        camelCase: false,
        _: [],
        $0: ''
    })

    const content = readFileSync("fixtures/checkSupportedFormat/CssModules.fs").toString()
    expect(content).toMatchSnapshot()
})

test('if internal is set to false module should not be marked as internal ', async () => {
    await handler({
        source: "fixtures/notInternalModule",
        outFile: 'fixtures/notInternalModule/CssModules.fs',
        internal: false,
        camelCase: false,
        _: [],
        $0: ''
    })

    const content = readFileSync("fixtures/notInternalModule/CssModules.fs").toString()
    expect(content).toMatchSnapshot()
})

test('module name with a dot should be transformed to a valid F# identifier', async () => {
    await handler({
        source: "fixtures/moduleWithDot",
        outFile: 'fixtures/moduleWithDot/CssModules.fs',
        internal: true,
        camelCase: false,
        _: [],
        $0: ''
    })

    const content = readFileSync("fixtures/moduleWithDot/CssModules.fs").toString()
    expect(content).toMatchSnapshot()
})

test('nested folder is supported', async () => {
    await handler({
        source: "fixtures/nestedFolder",
        outFile: 'fixtures/nestedFolder/CssModules.fs',
        internal: true,
        camelCase: false,
        _: [],
        $0: ''
    })

    const content = readFileSync("fixtures/nestedFolder/CssModules.fs").toString()
    expect(content).toMatchSnapshot()
})

test("nested CSS is supported", async () => {
    await handler({
        source: "fixtures/nestedCss",
        outFile: 'fixtures/nestedCss/CssModules.fs',
        internal: true,
        camelCase: false,
        _: [],
        $0: ''
    })

    const content = readFileSync("fixtures/nestedCss/CssModules.fs").toString()
    expect(content).toMatchSnapshot()
})

test("sanitize class name", async () => {
    await handler({
        source: "fixtures/sanitizeClasses",
        outFile: 'fixtures/sanitizeClasses/CssModules.fs',
        internal: true,
        camelCase: false,
        _: [],
        $0: ''
    })

    const content = readFileSync("fixtures/sanitizeClasses/CssModules.fs").toString()
    expect(content).toMatchSnapshot()
})

test("transformToCamelCase class name", async () => {
    await handler({
        source: "fixtures/transformToCamelCase",
        outFile: 'fixtures/transformToCamelCase/CssModules.fs',
        internal: true,
        camelCase: true,
        _: [],
        $0: ''
    })

    const content = readFileSync("fixtures/transformToCamelCase/CssModules.fs").toString()
    expect(content).toMatchSnapshot()
})
