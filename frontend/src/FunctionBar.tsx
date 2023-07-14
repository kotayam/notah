import { TextFunctionBarProps, ShapeFunctionBarProps } from "./Props.ts";

export function TextFunctionBar({ font, changeFont, fontSize, changeFontSize, bold, toggleBold, italic, toggleItalic}: TextFunctionBarProps) {
    let boldStyle;
    bold? boldStyle = "bg-gray-300": boldStyle = "bg-transparent";

    let italicStyle;
    italic? italicStyle = "bg-gray-300": italicStyle = "bg-transparent";

    return (
        <>
            <select className="hover:bg-gray-300 border-2 text-[18px]" value={font} onChange={e => {changeFont(e.target.value)}} name="font" id="font">
                <option value="calibri">Calibri</option>
                <option value="arial">Arial</option>
                <option value="times-new-roman">Times New Roman</option>
                <option value="georgia">Georgia</option>
                <option value="sans-serif">Sans-Serif</option>
            </select>
            <select className="hover:bg-gray-300 border-2 text-[18px]" value={fontSize} onChange={e => {changeFontSize(e.target.value)}} name="font-size" id="font-size">
                <option value="12">12</option>
                <option value="16">16</option>
                <option value="20">20</option>
                <option value="24">24</option>
                <option value="36">36</option>
                <option value="48">48</option>
                <option value="72">72</option>
            </select>
            <button className={`hover:bg-gray-300 active:bg-gray-400 text-[25px] w-[30px] rounded-none ${boldStyle}`} onClick={_ => toggleBold(bold)}><strong>B</strong></button>
            <button className={`hover:bg-gray-300 active:bg-gray-400 text-[25px] w-[30px] rounded-none ${italicStyle}`} onClick={_ => toggleItalic(italic)}><em>I</em></button>
            <button className={`hover:bg-gray-300 active:bg-gray-400 text-[25px] w-[30px] rounded-none`}><span className="underline">U</span></button>
        </>
        
    )
}

export function ShapeFunctionBar({ shape, changeShape }: ShapeFunctionBarProps) {
    const boldSelected = (thisShape: string) => {
        if (thisShape === shape) return 'bold';
        return 'normal';
    }

    const bgSelected = (thisShape: string) => {
        if (thisShape === shape) return 'rgb(209 213 219)';
        return '';
    }

    return (
        <>
        <button className="hover:bg-gray-300 active:bg-gray-400 border-1 py-2 px-6" style={{fontWeight: boldSelected('rect'), backgroundColor: bgSelected('rect')}} onClick={_ => changeShape('rect')}>Rectangle</button>
        <button className="hover:bg-gray-300 active:bg-gray-400 border-1 py-2 px-6" style={{fontWeight: boldSelected('circle'), backgroundColor: bgSelected('circle')}} onClick={_ => changeShape('circle')}>Circle</button>
        <button className="hover:bg-gray-300 active:bg-gray-400 border-1 py-2 px-6" style={{fontWeight: boldSelected('line'), backgroundColor: bgSelected('line')}} onClick={_ => changeShape('line')}>Line</button>
        </>
    )
}