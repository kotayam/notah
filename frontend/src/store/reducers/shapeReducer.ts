import { ShapeAction } from "../actions";
import { ActionType } from "../action-types";

const initialState: string = 'rect';

const shapeReducer = (state: string = initialState, action: ShapeAction) => {
    switch(action.type) {
        case ActionType.SHAPE:
            return action.payload;
        default:
            return state;
    }
}

export default shapeReducer;