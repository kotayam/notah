import { CanvasElement, TextBoxElement, ShapeElement, TableElement } from "src/Classes";
import { ActionType } from "../action-types";

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