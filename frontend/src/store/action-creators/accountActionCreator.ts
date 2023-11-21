import { ActionType } from "../action-types";
import { Dispatch } from "redux";
import { AccountAction } from "../actions"

export const setAccount = (account: {id: string, username: string, access: string}) => {
    return (dispatch: Dispatch<AccountAction>) => {
        dispatch({
            type: ActionType.ACOUNT,
            payload: account
        })
    }
}