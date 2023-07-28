import { ActionType } from "../action-types";
import { Dispatch } from "redux";
import { ModeAction } from "../actions"

export const changeMode = (mode: string) => {
    return (dispatch: Dispatch<ModeAction>) => {
        dispatch({
            type: ActionType.MODE,
            payload: mode
        })
    }
}