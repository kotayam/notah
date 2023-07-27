import { CanvasElement } from "src/Classes";
import { CanvasElementAction } from "../actions";
import { ActionType } from "../action-types";

const initialState: CanvasElement[] = [];

const canvasElementReducer = (state: CanvasElement[] = initialState, action: CanvasElementAction) => {
    switch(action.type) {
        case ActionType.ADD:
            return [...state, action.payload];
        case ActionType.DELETE:
            return state.filter(elt => elt.id !== action.payload.id);
        case ActionType.UPDATE:
            return action.payload;
        default:
            return state;
    }
}

export default canvasElementReducer;