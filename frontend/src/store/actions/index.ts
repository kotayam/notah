import { CanvasElement } from "src/Classes";
import { ActionType } from "../action-types";

interface AddCanvasElementAction {
  type: ActionType.ADD;
  payload: {pageId: string, canvasElement: CanvasElement};
}

interface DeleteCanvasElementAction {
  type: ActionType.DELETE;
  payload: {pageId: string, id: string, canvasElement: CanvasElement};
}

interface UpdateCanvasElementAction {
  type: ActionType.UPDATE;
  payload: {pageId: string, id: string, canvasElement: CanvasElement}
}

interface ClearCanvasElementsAction {
  type: ActionType.CLEAR;
  payload: {pageId: string}
}

export type CanvasElementAction =
  | AddCanvasElementAction
  | DeleteCanvasElementAction
  | UpdateCanvasElementAction
  | ClearCanvasElementsAction;

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

export type TextStyleAction =
  | ChangeFontAction
  | ChangeFontWeightAction
  | ChangeFontStyleAction
  | ChangeFontColorAction
  | ChangeFontSizeAction;

export type ModeAction = {
  type: ActionType.MODE;
  payload: string;
};

export type ShapeAction = {
  type: ActionType.SHAPE;
  payload: string;
};

export type TableAction = {
  type: ActionType.TABLE;
  payload: { row: number; col: number };
};

export type NoteBookAction = {
  type: ActionType.NOTEBOOK;
  payload: { id: string; title: string; dateCreated: string; lastEdited: string };
};

export type PageAction = {
  type: ActionType.PAGE;
  payload: { id: string; title: string; dateCreated: string; lastSaved: string };
};

export type AccountAction = {
  type: ActionType.ACOUNT;
  payload: { id: string; username: string; dateCreated: string; lastEdited: string; role: string; aiUsageLimit: number};
};

export type SaveAction = {
  type: ActionType.SAVE;
  payload: boolean;
}

export type ResetStateAction = {
  type: ActionType.RESET;
  payload: undefined;
}
