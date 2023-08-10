import { CanvasElement, TextBoxElement, TableElement, ShapeElement } from "./Classes";

export type ToolbarProps = {
 }

export type CanvasProps = {
}

export type TextBoxProps = {
    elt: TextBoxElement;
    selectTextBox: (elt: TextBoxElement) => void;
    selectedElt: {id: number, r: number, c: number};
    updateText: (newText: string) => void;
}

export type ShapeProps = {
    elt: ShapeElement;
}

export type TableProps = {
    elt: TableElement;
    selectTableText: (elt: TableElement, row: number, col: number) => void;
    selectedElt: {id: number, r: number, c: number};
    updateText: (newText: string) => void;
}

export type TableRowProps = {
    rowId: number;
    elt: TableElement;
    rowContent: string[];
    selectTableText: (elt: TableElement, row: number, col: number) => void;
    updateText: (newText: string) => void;
}

export type ModeSelectorProps = {
    thisMode: string;
}

export type ShapeFunctionBarProps = {
    shape: string;
    changeShape: (newShape: string) => void;
}

export type TableFunctionBarProps = {
    createTable: (row: number, col: number) => void;
}