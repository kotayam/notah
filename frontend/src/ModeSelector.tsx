import { ModeSelectorProps } from "./Props.ts";

export default function ModeSelector({ mode, thisMode, changeMode }: ModeSelectorProps) {
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