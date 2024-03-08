export const cssModuleRegex = /\.module\.(css|scss|sass)$/;

export const isCssModule = (fileName : string) => {
    return cssModuleRegex.test(fileName);
}

export const hyphenToCamelCase = (str : string) => {
    return str.replace(/([-]+)(\w)/g, (_, _g1, g2) => g2.toUpperCase());
}

export const sanitizeClassName = (str : string, transformToCamelCase : boolean) => {
    if (transformToCamelCase) {
        return hyphenToCamelCase(str);
    } else {
        if (str.indexOf("-") !== -1) {
            return "``" + str + "``";
        } else {
            return str;
        }
    }
}
