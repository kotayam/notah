import { ActionType } from "../action-types";
import { Dispatch } from "redux";
import { SaveAction } from "../actions"

export const setSaved = (isSaved: boolean) => {
    return (dispatch: Dispatch<SaveAction>) => {
        dispatch({
            type: ActionType.SAVE,
            payload: isSaved
        })
    }
}