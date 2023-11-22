import { NoteBookAction } from "../actions";
import { ActionType } from "../action-types";

const initialState = {id: "-1", title: "Quick Note", dateCreated: "default", lastEdited: "default"}

const noteBookReducer = (state = initialState , action: NoteBookAction) => {
    switch(action.type) {
        case ActionType.NOTEBOOK:
            return action.payload;
        default:
            return state;
    }
}

export default noteBookReducer;