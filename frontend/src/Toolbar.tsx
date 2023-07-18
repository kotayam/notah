import "./App.css";
import { ToolbarProps } from "./Props.ts";
import ModeSelector from "./ModeSelector.tsx";
import { TextFunctionBar, ShapeFunctionBar, TableFunctionBar } from "./FunctionBar.tsx";

export default function Toolbar({ mode, changeMode, fontSize, changeFontSize, font, changeFont, bold, toggleBold, italic, toggleItalic, shape, changeShape, createTable }: ToolbarProps) {
    const returnFunctionBar = () => {
        switch(mode) {
            case 'text': 
                return (
                <TextFunctionBar 
                    fontSize={fontSize} changeFontSize={changeFontSize} 
                    font={font} changeFont={changeFont} 
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

    return (
        <>
        <div className="w-full border-b-2">
            <div className="bg-amber-400 h-10 text-center">
                <button 
                className="float-left p-2"
                onClick={() => console.log('saved note')}
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
            </div>
            <div className="bg-gray-100 h-10 px-4">
                {returnFunctionBar()}
            </div>
        </div>
        </>
    )
}