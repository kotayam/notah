import { combineReducers } from "redux";
import canvasElementReducer from "./canvasElementReducer";
import textStyleReducer from "./textStyleReducer";
import modeReducer from "./modeReducer";
import shapeReducer from "./shapeReducer";

const rootReducer = combineReducers({
    canvasElements: canvasElementReducer,
    textStyle: textStyleReducer,
    shape: shapeReducer,
    mode: modeReducer
});

export default rootReducer;

export type rootState = ReturnType<typeof rootReducer>