import { TableAction } from "../actions";
import { ActionType } from "../action-types";

const initialState = {row: 0, col: 0}

const shapeReducer = (state = initialState, action: TableAction) => {
    switch(action.type) {
        case ActionType.TABLE:
            return action.payload;
        default:
            return state;
    }
}

export default shapeReducer;