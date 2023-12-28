import { ActionType } from "../action-types";
import { Dispatch } from "redux";
import { AccountAction } from "../actions"

export const setAccount = (account: {id: string, username: string, dateCreated: string, lastEdited: string, role: string, aiUsageLimit: number}) => {
    return (dispatch: Dispatch<AccountAction>) => {
        dispatch({
            type: ActionType.ACOUNT,
            payload: account
        })
    }
}