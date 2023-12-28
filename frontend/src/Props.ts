import { TextBoxElement, TableElement, ShapeElement, AIElement } from "./Classes";

export type HomeProps = {
    access: string;
}
export type ToolbarProps = {
    access: string;
 }

export type CanvasProps = {
    access: string;
}

export type NotesProps = {
    access: string;
}

export type TextBoxProps = {
    elt: TextBoxElement;
    selectTextBox: (elt: TextBoxElement) => void;
    selectedElt: {id: string, r: number, c: number};
}

export type ShapeProps = {
    elt: ShapeElement;
    selectShape: (elt: ShapeElement) => void;
    selectedElt: {id: string, r: number, c: number};
    drawing: boolean;
}

export type TableProps = {
    elt: TableElement;
    selectTableText: (elt: TableElement, row: number, col: number) => void;
    selectedElt: {id: string, r: number, c: number};
}

export type TableRowProps = {
    rowId: number;
    elt: TableElement;
    selectTableText: (elt: TableElement, row: number, col: number) => void;
}

export type AITextBoxProps = {
    elt: AIElement;
    selectAITextBox: (elt: AIElement) => void;
    selectedElt: {id: string, r: number, c: number};
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

export type NoteBookProps = {
    id: string;
    title: string;
    dateCreated: string;
    lastEdited: string;
    deleteNotebook: (id: string) => void;
}

export type PageProps = {
    id: string;
    title: string;
    dateCreated: string;
    lastSaved: string;
    deletePage: (id: string) => void;
}