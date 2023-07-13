import { CanvasElement, TextBoxElement } from "./Classes";

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
 }

export type CanvasProps = {
    mode: string;
    fontSize: number;
    font: string;
    bold: boolean;
    italic: boolean;
}

export type TextBoxProps = {
    elt: TextBoxElement;
}