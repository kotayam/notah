export class CanvasElement {
    id: number;
    x: number;
    y: number;
    selected: boolean;
    
    constructor(id: number, x: number, y: number, selected: boolean) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.selected = selected;
    }
}

export class TextBoxElement extends CanvasElement {
    text: string;
    font: string;
    fontSize: number;
    fontWeight: string;
    fontStyle: string;

    constructor(id: number, x: number, y: number, selected: boolean, text: string, font: string, fontSize: number, fontWeight: string, fontStyle: string) {
            super(id, x, y, selected);
            this.text = text;
            this.font = font;
            this.fontSize = fontSize;
            this.fontWeight = fontWeight;
            this.fontStyle = fontStyle;
    }
}

export class ShapeElement extends CanvasElement {
    shape: string;
    width: number;
    height: number;

    constructor(id: number, x: number, y: number, selected: boolean, shape: string, width: number, height: number) {
        super(id, x, y, selected);
        this.shape = shape;
        this.width = width;
        this.height = height;
    }
}

export class TableElement extends CanvasElement {
    row: number;
    col: number;
    headers: string[];
    content: string[][]

    constructor(id: number, x: number, y: number, selected: boolean, row: number, col: number, headers: string[], content: string[][]) {
        super(id, x, y, selected);
        this.row = row;
        this.col = col;
        this.headers = headers;
        this.content = content;
    }
}