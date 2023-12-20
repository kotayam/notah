import { combineReducers } from "redux";
import canvasElementReducer from "./canvasElementReducer";
import textStyleReducer from "./textStyleReducer";
import modeReducer from "./modeReducer";
import shapeReducer from "./shapeReducer";
import tableReducer from "./tableReducer";
import noteBookReducer from "./noteBookReducer";
import pageReducer from "./pageReducer";
import accountReducer from "./accountReducer";
import saveReducer from "./saveReducer";
import { ActionType } from "../action-types";

const appReducer = combineReducers({
    canvasElements: canvasElementReducer,
    textStyle: textStyleReducer,
    shape: shapeReducer,
    table: tableReducer,
    mode: modeReducer,
    noteBook: noteBookReducer,
    page: pageReducer,
    account: accountReducer,
    isSaved: saveReducer
});

const rootReducer = (state: any, action: any) => {
    switch (action.type) {
        case ActionType.RESET:
            localStorage.removeItem("persist:root");
            return appReducer(undefined, action);
        default:
            return appReducer(state, action);
    }
}

export default rootReducer;

export type rootState = ReturnType<typeof rootReducer>