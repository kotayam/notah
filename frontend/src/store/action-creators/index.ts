import { ActionType } from "../action-types";
import { Dispatch } from "redux";
import { CanvasElement } from "src/Classes";
import { CanvasElementAction } from "../actions";

export const addCanvasElement = (canvasElement: CanvasElement) => {
    return (dispatch: Dispatch<CanvasElementAction>) => {
        dispatch({
            type: ActionType.ADD,
            payload: canvasElement
        })
    }
}

export const deleteCanvasElement = (canvasElement: CanvasElement) => {
    return (dispatch: Dispatch<CanvasElementAction>) => {
        dispatch({
            type: ActionType.DELETE,
            payload: canvasElement
        })
    }
}

export const updateCanvasElement = (canvasElements: CanvasElement[]) => {
    return (dispatch: Dispatch<CanvasElementAction>) => {
        dispatch({
            type: ActionType.UPDATE,
            payload: canvasElements
        })
    }
}