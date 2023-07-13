import "./App.css";
import { ToolbarProps } from "./Props.ts";

export default function Toolbar({ mode, changeMode, fontSize, changeFontSize, font, changeFont, bold, toggleBold, italic, toggleItalic }: ToolbarProps) {
    let boldStyle;
    bold? boldStyle = "bg-gray-400": boldStyle = "bg-transparent";

    let italicStyle;
    italic? italicStyle = "bg-gray-400": italicStyle = "bg-transparent";

    return (
        <>
        <div className="w-full border-b-2">
            <div className="bg-amber-400 p-px h-8 text-center">
                <h1 className="font-bold">Notah</h1>
            </div>
            <div className="bg-gray-100 p-px">
                <input type="radio" id="text" onChange={e => {changeMode("text")}} checked={mode === "text"}/>
                <label htmlFor="text">Text</label>
                <input type="radio" id="table" onChange={e => {changeMode("table")}} checked={mode === "table"}/>
                <label htmlFor="table">Table</label>
                <input type="radio" id="draw" onChange={e => {changeMode("draw")}} checked={mode === "draw"}/>
                <label htmlFor="draw">Draw</label>
                <input type="radio" id="shape" onChange={e => {changeMode("shape")}} checked={mode === "shape"}/>
                <label htmlFor="shape">Shape</label>
            </div>
            <div className="bg-gray-100 p-px">
            <select className="border-2" value={font} onChange={e => {changeFont(e.target.value)}} name="font" id="font">
                <option value="calibri">Calibri</option>
                <option value="arial">Arial</option>
                <option value="times-new-roman">Times New Roman</option>
                <option value="georgia">Georgia</option>
                <option value="sans-serif">Sans-Serif</option>
            </select>
            <select className="border-2" value={fontSize} onChange={e => {changeFontSize(e.target.value)}} name="font-size" id="font-size">
                <option value="12">12</option>
                <option value="16">16</option>
                <option value="20">20</option>
                <option value="24">24</option>
                <option value="36">36</option>
                <option value="48">48</option>
                <option value="72">72</option>
            </select>
            <button className={`rounded-none w-[20px] ${boldStyle}`} onClick={e => toggleBold(bold)}><strong>B</strong></button>
            <button className={`rounded-none w-[20px] ${italicStyle}`} onClick={e => toggleItalic(italic)}><em>I</em></button>
            </div>
        </div>
        </>
    )
}