import { ActionType } from "../action-types";
import { Dispatch } from "redux";
import { NoteBookAction } from "../actions"

export const setNoteBook = (noteBook: {id: string, title: string}) => {
    return (dispatch: Dispatch<NoteBookAction>) => {
        dispatch({
            type: ActionType.NOTEBOOK,
            payload: noteBook
        })
    }
}