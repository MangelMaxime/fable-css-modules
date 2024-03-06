export const cssModuleRegex = /\.module\.(css|scss|sass)$/;

export const isCssModule = (fileName : string) => {
    return cssModuleRegex.test(fileName);
}

export const hyphenToCamelCase = (str : string) => {
    return str.replace(/[-](\w)/g, (_, p1) => p1.toUpperCase());
}
