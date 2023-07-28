import { ModeAction } from "../actions";
import { ActionType } from "../action-types";

const initialState: string = 'text';

const modeReducer = (state: string = initialState, action: ModeAction) => {
    switch(action.type) {
        case ActionType.MODE:
            return action.payload;
        default:
            return state;
    }
}

export default modeReducer;