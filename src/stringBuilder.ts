export default class StringBuilder {
    private _lines: string[] = [];

    write(line: string = ""): void {
        this._lines.push(line);
    }

    writeLine(line: string = ""): void {
        this._lines.push(line);
        this._lines.push("\n");
    }

    indent(factor : number = 1) : void {
        this.space(factor * 4);
    }

    space(factor : number = 1) : void {
        let space = " ".repeat(factor);
        this.write(space);
    }

    toString(): string {
        return this._lines.join("");
    }
}
