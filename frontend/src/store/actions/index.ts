import { CanvasElement } from "src/Classes";
import { ActionType } from "../action-types";
import { Action } from "redux";

interface AddCanvasElementAction {
    type: ActionType.ADD;
    payload: CanvasElement;
}

interface DeleteCanvasElementAction {
    type: ActionType.DELETE;
    payload: CanvasElement;
}

interface UpdateCanvasElementAction {
    type: ActionType.UPDATE;
    payload: CanvasElement[];
}

export type CanvasElementAction = AddCanvasElementAction | DeleteCanvasElementAction | UpdateCanvasElementAction;

interface ChangeFontAction {
    type: ActionType.FONT;
    payload: string;
}

interface ChangeFontWeightAction {
    type: ActionType.FONT_WEIGHT;
    payload: string;
}

interface ChangeFontStyleAction {
    type: ActionType.FONT_STYLE;
    payload: string;
}

interface ChangeFontColorAction {
    type: ActionType.FONT_COLOR;
    payload: string;
}

interface ChangeFontSizeAction {
    type: ActionType.FONT_SIZE;
    payload: number;
}

export type TextStyleAction  = ChangeFontAction | ChangeFontWeightAction | ChangeFontStyleAction | ChangeFontColorAction | ChangeFontSizeAction;

export type ModeAction = {
    type: ActionType.MODE;
    payload: string;
}

export type ShapeAction = {
    type: ActionType.SHAPE;
    payload: string;
}

export type TableAction = {
    type: ActionType.TABLE;
    payload: {row: number, col: number};
}

export type NoteBookAction = {
    type: ActionType.NOTEBOOK;
    payload: {id: string, title: string};
}

export type PageAction = {
    type: ActionType.PAGE;
    payload: {id: string, title: string};
}