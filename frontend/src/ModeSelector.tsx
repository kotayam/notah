import { ModeSelectorProps } from "./Props.ts";
import { rootState } from "./store/index.ts";
import { bindActionCreators } from "@reduxjs/toolkit";
import { actionCreators } from "./store/index.ts";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

export default function ModeSelector({ thisMode }: ModeSelectorProps) {
    const mode = useSelector((state: rootState) => state.mode);
    const dispatch = useDispatch();
    const { changeMode } =bindActionCreators(actionCreators, dispatch);

    const boldSelected = () => {
        if (thisMode.toLowerCase() === mode) return 'bold';
        return 'normal';
    }

    const underlineSelected = () => {
        if (thisMode.toLowerCase() === mode) return 'underline #fbbf24 4px';
        return '';
    }

    return (
        <>
        <button 
        className="hover:bg-white py-2 px-6 decoration-amber-400 decoration-4 underline-offset-4" 
        style={{fontWeight: boldSelected(), textDecoration: underlineSelected() }}
        onClick={_ => {changeMode(thisMode.toLowerCase())}}
        >
        {thisMode}
        </button>
        </>
    )
}