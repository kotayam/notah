import { ActionType } from "../action-types";
import { Dispatch } from "redux";
import { PageAction } from "../actions"

export const setPage = (page: {id: string, title: string, dateCreated: string, lastSaved: string}) => {
    return (dispatch: Dispatch<PageAction>) => {
        dispatch({
            type: ActionType.PAGE,
            payload: page
        })
    }
}