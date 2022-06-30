import path from "path"
import StringBuilder from "./stringBuilder"
import { hyphenToCamelCase, isCssModule } from "./utils"
import fs from "fs/promises"

interface Module {
    name: string
    subModules: Module[]
    classes: string[]
}

export class ClassCollector {

    private _modules: Module[] = [];
    private _cwd: string;
    private _destination: string;
    private _sourceFolder : string;
    private _internal : boolean;

    constructor(cwd: string, sourceFolder : string, destination: string, internal : boolean) {
        this._cwd = cwd;
        this._sourceFolder = sourceFolder;
        this._destination = destination;
        this._internal = internal;
    }

    /**
     * Save the provide class into the arborescence of modules.
     *
     * @param filePath The path of the file to process
     * @param className The class name to store
     */
    saveClass(filePath: string, className: string) {
        // Compute relative path compared to the CWD
        const relativePath =
            path.relative(this._cwd, filePath)
                .replace(/\\/g, "/");

        let segments = [];

        if (relativePath.startsWith(this._sourceFolder)) {
            segments = relativePath.replace(this._sourceFolder, "").split("/").slice(1);
        } else {
            segments = relativePath.split("/");
        }

        this.save(undefined, this._modules, segments, className);
    }

    /**
     * Try to find the module where the class should be stored.
     *
     * If the module is unknown, this method will create them.
     *
     * @param knownModules The list of modules known
     * @param segments Segments of the path left to process
     * @param className The class name to store
     */
    private save(
        parentModule: Module | undefined,
        knownModules: Module[],
        segments: string[],
        className: string) {
        const originalCurrentSegment = segments.shift();

        if (!originalCurrentSegment) {
            throw "Panic: segments should not be empty";
        }

        const currentSegment = originalCurrentSegment.replace(/\.module\.(css|scss|sass)/, "");

        const destinationModuleCandidate =
            knownModules.find((module) => {
                return module.name === currentSegment;
            });

        if (destinationModuleCandidate) {

            // If we didn't reach the end of the segments, keep looking for the destination module
            if (segments.length > 0) {
                this.save(destinationModuleCandidate, destinationModuleCandidate.subModules, segments, className);
                // This is the end of the segments, store the className in the module
            } else {
                destinationModuleCandidate.classes.push(className);
            }

        // The destination module does not exist yet
        } else {

            // It is possible that a CSS module is named the same as its parent folder
            //
            // Example:
            // src
            //  |- CallCard
            //      |- CallCard.module.scss
            //
            // In this case, we don't create a new sub module, but we add the class to the existing module
            // This will improve the code generation later by generating:
            //
            //  module CallCard =
            //      type Classes =
            //
            // instead of
            //
            // module CallCard =
            //     module CallCard =
            //         type Classes =
            if (isCssModule(originalCurrentSegment) && parentModule?.name === currentSegment) {
                parentModule.classes.push(className);
            } else {
                const newModule: Module = {
                    name: currentSegment,
                    subModules: [],
                    classes: []
                }

                knownModules.push(newModule);

                // If we didn't reach the end of the segments, keep looking for the destination module
                if (segments.length > 0) {
                    this.save(newModule, newModule.subModules, segments, className);
                    // This is the end of the segments, store the className in the module
                } else {
                    newModule.classes.push(className);
                }
            }
        }
    }

    moduleToText(sb: StringBuilder, module: Module, indent: number) {

        if (module.classes.length > 0) {
            sb.indent(indent);
            sb.writeLine(`type ${module.name} =`);
            sb.writeLine();

            // The same class can be present mutiple times, for example when doing:
            // .container { ... }
            // .container .sub-element { ... }
            const uniqueClassNames = module.classes.filter((v, i, a) => a.indexOf(v) === i);

            for (const className of uniqueClassNames) {
                sb.indent(indent + 1);
                sb.writeLine("/// <summary>")
                sb.indent(indent + 1);
                sb.writeLine(`/// Binding for <c>${className}</c> class`);
                sb.indent(indent + 1);
                sb.writeLine("/// </summary>")
                sb.indent(indent + 1);
                sb.writeLine(`[<Emit("$0[\\\"${className}\\\"]")>]`);
                sb.indent(indent + 1);
                sb.writeLine(`abstract ${hyphenToCamelCase(className)} : string`);
                sb.writeLine();
            }
        }

        if (module.subModules.length > 0) {
            sb.indent(indent);
            sb.writeLine(`module ${module.name} =`);
            sb.writeLine();
        }

        for (const subModule of module.subModules) {
            this.moduleToText(sb, subModule, indent + 1);
        };
    }

    async writeToFile() {
        if (this._modules.length == 0) {
            console.log("No classes found");
            return;
        }

        let sb = new StringBuilder();

        const internalPrefix = this._internal ? "internal " : "";

        // Add the prelude to the destination file
        sb.writeLine(`//------------------------------------------------------------------------------
//        This code was generated by fable-css-modules.
//        Changes to this file will be lost when the code is regenerated.
//------------------------------------------------------------------------------

[<RequireQualifiedAccess>]
module ${internalPrefix}CssModules

open Fable.Core
`);

        // Generate all the modules
        for (const module of this._modules) {
            this.moduleToText(sb, module, 0);
        }

        const content = sb.toString();
        // Make sure the destination path exists
        await fs.mkdir(path.dirname(this._destination), { recursive: true });
        // Write the content to the destination file
        await fs.writeFile(this._destination, content);
    }

}
