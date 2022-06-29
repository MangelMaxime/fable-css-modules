import type { Arguments, CommandBuilder } from "yargs";
import fg from "fast-glob";
import postcss from "postcss";
import { ClassCollector } from "../classCollector";
import { PostcssCollectorPlugin } from "../postcssCollectorPlugin";
import { getCssContent } from "../css";
import path from "path";

type Options = {
    source: string;
    outFile: string;
    internal : boolean
};

export const command: string = "$0 [source]";
export const desc: string = 'Generate bindings for all the CSS modules in <source> folder to <outFile> file';

export const builder: CommandBuilder<Options, Options> = (yargs) =>
    yargs
        .options({
            outFile: {
                describe: 'Output file where the binding will be written',
                type: 'string',
                default: 'CssModules.fs'
            },
            internal: {
                describe: 'Mark the generated module as internal',
                type: 'boolean',
                default: true
            }
        })
        .positional("source", {
            describe: 'Folder where the CSS modules are located',
            type: 'string',
            default: '.'
        });

export const handler = async (argv: Arguments<Options>) => {
    const sourceFolder = path.normalize(argv.source).replace(/\\/g, '/');
    const destinationFile = path.normalize(argv.outFile).replace(/\\/g, '/');

    const entries = await fg(`${sourceFolder}/**/*.module.scss`);

    const classCollector =
        new ClassCollector(
            process.cwd(),
            sourceFolder,
            destinationFile,
            argv.internal
        );

    for (const entry of entries) {
        // Transform from SASS to CSS
        const cssContent = await getCssContent(entry);

        // Register the postcss plugins
        const plugins = [
            PostcssCollectorPlugin({ collector: classCollector })
        ];

        // Run postcss to collect the classes
        await postcss(plugins).process(cssContent, { from: entry })
    }

    // Write the content to the destination file
    await classCollector.writeToFile();

    // Notify the user
    console.log("Generation completed");
};
