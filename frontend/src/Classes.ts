export class CanvasElement {
    id: string;
    x: number;
    y: number;
    
    constructor(id: string, x: number, y: number) {
        this.id = id;
        this.x = x;
        this.y = y;
    }
}

export class TextBoxElement extends CanvasElement {
    content: string;
    font: string;
    fontSize: number;
    fontColor: string;
    fontWeight: string;
    fontStyle: string;

    constructor(id: string, x: number, y: number, content: string, font: string, fontSize: number, fontColor: string, fontWeight: string, fontStyle: string) {
            super(id, x, y);
            this.content = content;
            this.font = font;
            this.fontSize = fontSize;
            this.fontColor = fontColor;
            this.fontWeight = fontWeight;
            this.fontStyle = fontStyle;
    }
}

export class ShapeElement extends CanvasElement {
    shape: string;
    width: number;
    height: number;

    constructor(id: string, x: number, y: number, shape: string, width: number, height: number) {
        super(id, x, y);
        this.shape = shape;
        this.width = width;
        this.height = height;
    }
}

export class TableElement extends CanvasElement {
    row: number;
    col: number;
    tableContent: string[][]

    constructor(id: string, x: number, y: number, row: number, col: number, tableContent: string[][]) {
        super(id, x, y);
        this.row = row;
        this.col = col;
        this.tableContent = tableContent;
    }
}