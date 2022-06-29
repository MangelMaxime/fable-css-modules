import fs from "fs/promises"
import sass from "sass"

export const getCssContent = async (entry : string) : Promise<string> => {
    // If this a SCSS or SASS file, compile it to CSS
    if (entry.endsWith(".scss") || entry.endsWith(".sass")) {
        return sass.compile(entry).css;
    } else {
        const buffer = await fs.readFile(entry);

        return buffer.toString();
    }
}
