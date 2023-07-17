import { CanvasElement, TextBoxElement, TableElement } from "./Classes";

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
 }

export type CanvasProps = {
    mode: string;
    fontSize: number;
    font: string;
    bold: boolean;
    italic: boolean;
    shape: string;
}

export type TextBoxProps = {
    elt: TextBoxElement;
    selectTextBox: (elt: TextBoxElement) => void;
    x: number;
    y: number;
}

export type TableProps = {
    elt: TableElement;
    x: number;
    y: number;
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