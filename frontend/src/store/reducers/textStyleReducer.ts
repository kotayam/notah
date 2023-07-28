import { TextStyleAction } from "../actions";
import { ActionType } from "../action-types";

type TextStyle = {
    font: string;
    fontWeight: string;
    fontStyle: string;
    fontColor: string;
    fontSize: number;
}

const initialState: TextStyle = {font: 'sans-serif', fontWeight: 'normal', fontStyle: 'normal', fontColor: 'black', fontSize: 16};

const textStyleReducer = (state: TextStyle = initialState, action: TextStyleAction) => {
    switch(action.type) {
        case ActionType.FONT:
            state.font = action.payload;
            return state;
        case ActionType.FONT_WEIGHT:
            state.fontWeight = action.payload;
            return state;
        case ActionType.FONT_STYLE:
            state.fontStyle = action.payload;
            return state;
        case ActionType.FONT_COLOR:
            state.fontColor = action.payload;
            return state;
        case ActionType.FONT_SIZE:
            state.fontSize = action.payload;
            return state;
        default:
            return state;
    }
}

export default textStyleReducer;