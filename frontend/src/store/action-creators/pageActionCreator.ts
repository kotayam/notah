import { ActionType } from "../action-types";
import { Dispatch } from "redux";
import { PageAction } from "../actions"

export const setPage = (page: {id: string, title: string}) => {
    return (dispatch: Dispatch<PageAction>) => {
        dispatch({
            type: ActionType.PAGE,
            payload: page
        })
    }
}