import path from "path";
import { Plugin } from "postcss";
import createSelectorParser from "postcss-selector-parser";
import { ClassCollector } from "./classCollector";

type PluginOptions = {
    collector: ClassCollector
}

export function PostcssCollectorPlugin(opts: PluginOptions): Plugin {

    return {
        postcssPlugin: "postcss-fable-binding",
        Root: (root) => {
            if (root.source?.input.file) {
                const file = root.source.input.file;

                // Compute relative path compared to the CWD
                const relativePath = path.relative(process.cwd(), file).replace(/\\/g, "/");

                const parser = createSelectorParser((selectors) => {
                    selectors.each((selector) => {
                        for (const node of selector.nodes) {
                            if (node.type === "class") {
                                opts.collector.saveClass(relativePath, node.value);
                            }
                        }
                    });
                });

                root.walkRules((rule) => {
                    parser.process(rule, { lossless: true });
                })
            }
        }
    }
}
