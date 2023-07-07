import "./App.css";

type ToolbarProps = {
    mode: string;
    changeMode: (newMode: string) => void;
    fontSize: number;
    changeFontSize: (newFontSize: string) => void;
    font: string;
    changeFont: (newFont: string) => void;
    bold: boolean;
    toggleBold: (isBold: boolean) => void;
 }

export default function Toolbar({ mode, changeMode, fontSize, changeFontSize, font, changeFont, bold, toggleBold }: ToolbarProps) {
    let boldStyle;
    if (bold) {
        boldStyle = "bg-stone-700";
    } else {
        boldStyle = "bg-transparent";
    }

    return (
        <>
            <div className="flex place-content-center h-10 w-screen">
                <div className="w-240 border-2 bg-gray-300">
                    <input type="radio" id="text" onChange={e => {changeMode("text")}} checked={mode === "text"}/>
                    <label htmlFor="text">Text</label>
                    <input type="radio" id="table" onChange={e => {changeMode("table")}} checked={mode === "table"}/>
                    <label htmlFor="table">Table</label>
                    <input type="radio" id="draw" onChange={e => {changeMode("draw")}} checked={mode === "draw"}/>
                    <label htmlFor="draw">Draw</label>
                    <input type="radio" id="shape" onChange={e => {changeMode("shape")}} checked={mode === "shape"}/>
                    <label htmlFor="shape">Shape</label>
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
                    <button className={`rounded-none ${boldStyle}`} onClick={e => toggleBold(bold)}>B</button>
                </div>
            </div>
        </>
    )
}