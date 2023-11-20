export class CanvasElement {
    id: string;
    x: number;
    y: number;
    innerHtml: string;
    
    constructor(id: string, x: number, y: number, innerHtml: string) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.innerHtml = innerHtml;
    }
}

export class TextBoxElement extends CanvasElement {
    font: string;
    fontSize: number;
    fontColor: string;
    fontWeight: string;
    fontStyle: string;

    constructor(id: string, x: number, y: number, innerHtml: string, font: string, fontSize: number, fontColor: string, fontWeight: string, fontStyle: string) {
            super(id, x, y, innerHtml);
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

    constructor(id: string, x: number, y: number, innerHtml: string, shape: string, width: number, height: number) {
        super(id, x, y, innerHtml);
        this.shape = shape;
        this.width = width;
        this.height = height;
    }
}

export class TableElement extends CanvasElement {
    row: number;
    col: number;

    constructor(id: string, x: number, y: number, innerHtml: string, row: number, col: number) {
        super(id, x, y, innerHtml);
        this.row = row;
        this.col = col;
    }
}