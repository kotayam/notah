import { NoteBookAction } from "../actions";
import { ActionType } from "../action-types";

const initialState = {id: "quick-note", title: "Quick Note"}

const noteBookReducer = (state = initialState , action: NoteBookAction) => {
    switch(action.type) {
        case ActionType.NOTEBOOK:
            return action.payload;
        default:
            return state;
    }
}

export default noteBookReducer;