import { ActionType } from "../action-types";
import { Dispatch } from "redux";
import { ShapeAction } from "../actions"

export const changeShape = (shape: string) => {
    return (dispatch: Dispatch<ShapeAction>) => {
        dispatch({
            type: ActionType.SHAPE,
            payload: shape
        })
    }
}