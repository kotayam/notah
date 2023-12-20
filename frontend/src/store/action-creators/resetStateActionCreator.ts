import { ActionType } from "../action-types";
import { Dispatch } from "redux";
import { ResetStateAction } from "../actions"

export const resetState = () => {
    return (dispatch: Dispatch<ResetStateAction>) => {
        dispatch({
            type: ActionType.RESET,
            payload: undefined
        })
    }
}