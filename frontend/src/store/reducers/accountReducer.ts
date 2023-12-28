import { AccountAction } from "../actions";
import { ActionType } from "../action-types";

const initialState = {id: "-1", username: "default", dateCreated: "default", lastEdited: "default", role: "user", aiUsageLimit: 0};

const accountReducer = (state = initialState , action: AccountAction) => {
    switch(action.type) {
        case ActionType.ACOUNT:
            return action.payload;
        default:
            return state;
    }
}

export default accountReducer;