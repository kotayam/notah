import { combineReducers } from "redux";
import canvasElementReducer from "./canvasElementReducer";
import textStyleReducer from "./textStyleReducer";
import modeReducer from "./modeReducer";
import shapeReducer from "./shapeReducer";
import tableReducer from "./tableReducer";

const rootReducer = combineReducers({
    canvasElements: canvasElementReducer,
    textStyle: textStyleReducer,
    shape: shapeReducer,
    table: tableReducer,
    mode: modeReducer
});

export default rootReducer;

export type rootState = ReturnType<typeof rootReducer>