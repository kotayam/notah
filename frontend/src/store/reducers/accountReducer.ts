import { AccountAction } from "../actions";
import { ActionType } from "../action-types";

const initialState = {id: "0", fullName: "First Last"}

const accountReducer = (state = initialState , action: AccountAction) => {
    switch(action.type) {
        case ActionType.ACOUNT:
            return action.payload;
        default:
            return state;
    }
}

export default accountReducer;