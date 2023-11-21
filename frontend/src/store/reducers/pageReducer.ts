import { PageAction } from "../actions";
import { ActionType } from "../action-types";

const initialState = {id: "-1", title: "Page 1"}

const pageReducer = (state = initialState , action: PageAction) => {
    switch(action.type) {
        case ActionType.PAGE:
            return action.payload;
        default:
            return state;
    }
}

export default pageReducer;