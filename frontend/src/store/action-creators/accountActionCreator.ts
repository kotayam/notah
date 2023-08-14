import { ActionType } from "../action-types";
import { Dispatch } from "redux";
import { AccountAction } from "../actions"

export const setAccount = (account: {id: string, fullName: string}) => {
    return (dispatch: Dispatch<AccountAction>) => {
        dispatch({
            type: ActionType.ACOUNT,
            payload: account
        })
    }
}