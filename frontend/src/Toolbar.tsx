import "./App.css";
import { ToolbarProps } from "./Props.ts";
import ModeSelector from "./ModeSelector.tsx";
import { TextFunctionBar, ShapeFunctionBar, TableFunctionBar } from "./FunctionBar.tsx";
import { jsPDF } from "jspdf";

export default function Toolbar({ mode, changeMode, fontSize, changeFontSize, font, changeFont, fontColor, changeFontColor, bold, toggleBold, italic, toggleItalic, shape, changeShape, createTable }: ToolbarProps) {
    const returnFunctionBar = () => {
        switch(mode) {
            case 'text': 
                return (
                <TextFunctionBar 
                    fontSize={fontSize} changeFontSize={changeFontSize} 
                    font={font} changeFont={changeFont} 
                    fontColor={fontColor} changeFontColor={changeFontColor}
                    bold={bold} toggleBold={toggleBold}
                    italic={italic} toggleItalic={toggleItalic}
                />)
            case 'shape':
                return (
                <ShapeFunctionBar
                    shape={shape} changeShape={changeShape}
                />)
            case 'table':
                return (
                <TableFunctionBar
                    createTable={createTable}
                />
                )
        }
    }

    const save = () => {
        const head = document.getElementById("canvas-container");
        console.log(head);
    }

    const saveAsPdf = async () => {
        const note = document.getElementById("canvas-container");
        if (note) {
            const rect = note.getBoundingClientRect();
            // const canvas = await html2canvas(note, {scale: 2, width: rect.width, height: rect.height});
            const pdf = new jsPDF('p', 'mm', 'a4');
            const width = pdf.internal.pageSize.getWidth();
            pdf.html(note, {
                callback: function(doc) {
                    // Save the PDF
                    doc.save('note.pdf');
                },
                x: 15,
                y: 15,
                width: width,
                windowWidth: rect.width
            })
            // pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, width, height);
            // pdf.save('note');
        }  
    }

    const undo = () => {
        
    }

    return (
        <>
        <div className="w-full border-b-2">
            <div className="bg-amber-400 h-10 text-center">
                <button 
                className="float-left p-2 bg-amber-300"
                onClick={() => undo()}
                >
                Undo
                </button>
                <button 
                className="float-left p-2 bg-amber-300"
                onClick={() => save()}
                >
                Save
                </button>
                <h1 className="font-bold">Notah</h1>
            </div>
            <div className="bg-gray-100 p-px">
                <ModeSelector mode={mode} thisMode={'Text'} changeMode={changeMode}/>
                <ModeSelector mode={mode} thisMode={'Shape'} changeMode={changeMode}/>
                <ModeSelector mode={mode} thisMode={'Table'} changeMode={changeMode}/>
                <ModeSelector mode={mode} thisMode={'Draw'} changeMode={changeMode}/>
                <button className="float-right h-full bg-gray-200 p-2" onClick={_ => saveAsPdf()}>Save as PDF</button>
            </div>
            <div className="bg-gray-100 h-10 px-4">
                {returnFunctionBar()}
            </div>
        </div>
        </>
    )
}