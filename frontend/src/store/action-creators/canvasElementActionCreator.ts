import { ActionType } from "../action-types";
import { Dispatch } from "redux";
import { CanvasElement } from "src/Classes";
import { CanvasElementAction } from "../actions";

export const addCanvasElement = (pageId: string, canvasElement: CanvasElement) => {
    return (dispatch: Dispatch<CanvasElementAction>) => {
        dispatch({
            type: ActionType.ADD,
            payload: {pageId: pageId, canvasElement: canvasElement}
        })
    }
}

export const deleteCanvasElement = (pageId: string, id: string, canvasElement: CanvasElement) => {
    return (dispatch: Dispatch<CanvasElementAction>) => {
        dispatch({
            type: ActionType.DELETE,
            payload: {pageId: pageId, id: id, canvasElement: canvasElement}
        })
    }
}

export const updateCanvasElement = (pageId: string, id: string, canvasElement: CanvasElement) => {
    return (dispatch: Dispatch<CanvasElementAction>) => {
        dispatch({
            type: ActionType.UPDATE,
            payload: {pageId: pageId, id: id, canvasElement: canvasElement}
        })
    }
}

export const clearCanvasElements = (pageId: string) => {
    return (dispatch: Dispatch<CanvasElementAction>) => {
        dispatch({
            type: ActionType.CLEAR,
            payload: {pageId: pageId}
        })
    }
}