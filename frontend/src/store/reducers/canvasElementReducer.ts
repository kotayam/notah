import { CanvasElement } from "src/Classes";
import { CanvasElementAction } from "../actions";
import { ActionType } from "../action-types";

const initialState = new Map<string, CanvasElement[]>();

const canvasElementReducer = (
  state: Map<string, CanvasElement[]> = initialState,
  action: CanvasElementAction
) => {
  state = new Map(state);
  switch (action.type) {
    case ActionType.ADD:
      if (!state.has(action.payload.pageId)) {
        const canvasElts = [action.payload.canvasElement];
        state.set(action.payload.pageId, canvasElts);
      } else {
        let canvasElts = state.get(action.payload.pageId);
        if (canvasElts) {
          canvasElts = [...canvasElts, action.payload.canvasElement];
          state.set(action.payload.pageId, canvasElts);
        }
      }
      return state;
    case ActionType.DELETE:
      if (!state.has(action.payload.pageId)) return state;
      else {
        let canvasElts = state.get(action.payload.pageId);
        if (canvasElts) {
          canvasElts = canvasElts.filter((elt) => elt.id !== action.payload.id);
          state.set(action.payload.pageId, canvasElts);
        }
      }
      return state;
    case ActionType.UPDATE:
      if (!state.has(action.payload.pageId)) return state;
      else {
        let canvasElts = state.get(action.payload.pageId);
        if (canvasElts) {
          const other = canvasElts.filter(
            (elt) => elt.id !== action.payload.id
          );
          canvasElts = [...other, action.payload.canvasElement];
          state.set(action.payload.pageId, canvasElts);
        }
      }
      return state;
    case ActionType.CLEAR:
      if (!state.has(action.payload.pageId)) return state;
      else {
        state.set(action.payload.pageId, []);
      }
      return state;
    default:
      return state;
  }
};

export default canvasElementReducer;
