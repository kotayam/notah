import { ActionType } from "../action-types";
import { Dispatch } from "redux";
import { TableAction } from "../actions"

export const createTable = (dimension: {row: number, col: number}) => {
    return (dispatch: Dispatch<TableAction>) => {
        dispatch({
            type: ActionType.TABLE,
            payload: dimension
        })
    }
}