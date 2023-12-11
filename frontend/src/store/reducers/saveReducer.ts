import { SaveAction } from "../actions";
import { ActionType } from "../action-types";

const initialState = false;

const saveReducer = (state = initialState , action: SaveAction) => {
    switch(action.type) {
        case ActionType.SAVE:
            return action.payload;
        default:
            return state;
    }
}

export default saveReducer;