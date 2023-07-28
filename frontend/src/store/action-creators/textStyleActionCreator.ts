import { ActionType } from "../action-types";
import { Dispatch } from "redux";
import { TextStyleAction } from "../actions"


export const changeFont = (font: string) => {
    return (dispatch: Dispatch<TextStyleAction>) => {
        dispatch({
            type: ActionType.FONT,
            payload: font
        })
    }
}

export const changeFontWeight = (fontWeight: string) => {
    return (dispatch: Dispatch<TextStyleAction>) => {
        dispatch({
            type: ActionType.FONT_WEIGHT,
            payload: fontWeight
        })
    }
}

export const changeFontStyle = (fontStyle: string) => {
    return (dispatch: Dispatch<TextStyleAction>) => {
        dispatch({
            type: ActionType.FONT_STYLE,
            payload: fontStyle
        })
    }
}

export const changeFontColor = (fontColor: string) => {
    return (dispatch: Dispatch<TextStyleAction>) => {
        dispatch({
            type: ActionType.FONT_COLOR,
            payload: fontColor
        })
    }
}

export const changeFontSize = (fontSize: number) => {
    return (dispatch: Dispatch<TextStyleAction>) => {
        dispatch({
            type: ActionType.FONT_SIZE,
            payload: fontSize
        })
    }
}