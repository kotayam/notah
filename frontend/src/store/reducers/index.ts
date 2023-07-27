import { combineReducers } from "redux";
import canvasElementReducer from "./canvasElementReducer";

const rootReducer = combineReducers({
    canvasElements: canvasElementReducer
});

export default rootReducer;

export type rootState = ReturnType<typeof rootReducer>