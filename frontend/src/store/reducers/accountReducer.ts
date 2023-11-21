import { AccountAction } from "../actions";
import { ActionType } from "../action-types";

const initialState = {id: "-1", username: "default", access: "guest"}

const accountReducer = (state = initialState , action: AccountAction) => {
    switch(action.type) {
        case ActionType.ACOUNT:
            return action.payload;
        default:
            return state;
    }
}

export default accountReducer;