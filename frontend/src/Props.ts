import { CanvasElement, TextBoxElement, TableElement, ShapeElement } from "./Classes";

export type ToolbarProps = {
    mode: string;
    changeMode: (newMode: string) => void;
    fontSize: number;
    changeFontSize: (newFontSize: string) => void;
    font: string;
    changeFont: (newFont: string) => void;
    bold: boolean;
    toggleBold: (isBold: boolean) => void;
    italic: boolean;
    toggleItalic: (isItalic: boolean) => void;
    shape: string;
    changeShape: (newShape: string) => void;
    createTable: (row: number, col: number) => void;
 }

export type CanvasProps = {
    mode: string;
    changeMode: (newMode: string) => void;
    fontSize: number;
    font: string;
    bold: boolean;
    italic: boolean;
    shape: string;
    headers: string[];
    content: string[][];
    updateHistory: (elts: CanvasElement[]) => void;
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
    mode: string;
    thisMode: string;
    changeMode: (newMode: string) => void;
}

export type TextFunctionBarProps = {
    fontSize: number;
    changeFontSize: (newFontSize: string) => void;
    font: string;
    changeFont: (newFont: string) => void;
    bold: boolean;
    toggleBold: (isBold: boolean) => void;
    italic: boolean;
    toggleItalic: (isItalic: boolean) => void;
}

export type ShapeFunctionBarProps = {
    shape: string;
    changeShape: (newShape: string) => void;
}

export type TableFunctionBarProps = {
    createTable: (row: number, col: number) => void;
}