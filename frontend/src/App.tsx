import "./App.css";
import { useState } from "react";
import Toolbar from "./Toolbar.tsx";
import Canvas from "./Canvas.tsx";
import Notes from "./Notes.tsx";
import { CanvasElement } from "./Classes.ts";

function App() {
  const [mode, setMode] = useState("text");
  const [fontSize, setFontSize] = useState(16);
  const [font, setFont] = useState("sans-serif");
  const [fontColor, setFontColor] = useState('black');
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [shape, setShape] = useState('rect');
  const [tableContent, setTableContent] = useState<string[][]>([])
  const [actionHistory, setActionHistory] = useState<CanvasElement[]>([]);

  const changeMode = (newMode: string) => {
    setMode(newMode);
    console.log(`mode changed to: ${newMode}`);
  }

  const changeFontSize = (newFontSize: string) => {
    setFontSize(parseInt(newFontSize));
    console.log(`font size changed to: ${newFontSize}`);
  }

  const changeFont = (newFont: string) => {
    setFont(newFont);
    console.log(`font changed to: ${newFont}`);
  }

  const changeFontColor = (newFontColor: string) => {
    setFontColor(newFontColor);
    console.log(`font color changed to: ${newFontColor}`);
  }

  const toggleBold = (isBold: boolean) => {
    isBold? setBold(false) : setBold(true);
    console.log(`Bold mode: ${!isBold}`);

    }

  const toggleItalic = (isItalic: boolean) => {
    isItalic? setItalic(false) : setItalic(true);
    console.log(`Italic mode: ${!isItalic}`);
  }

  const changeShape = (newShape: string) => {
    setShape(newShape);
    console.log(`shape changed to: ${newShape}`);
  }

  const createTable = (row: number, col: number) => {
    console.log(`row: ${row}, col: ${col}`);
    const tableContent = new Array(row);
    tableContent.fill(new Array(col));
    for (let r = 0; r < tableContent.length; r++) {
      for (let c = 0; c < tableContent[r].length; c++) {
        tableContent[r][c] = '';
      }
    }
    setTableContent(tableContent);
    changeMode('table');
  }

  const updateHistory = (elts: CanvasElement[]) => {
    setActionHistory(elts);
  }

  return (
    <>
    <div>
      <Toolbar 
        mode={mode} changeMode={changeMode} 
        fontSize={fontSize} changeFontSize={changeFontSize} 
        font={font} changeFont={changeFont} 
        fontColor={fontColor} changeFontColor={changeFontColor}
        bold={bold} toggleBold={toggleBold}
        italic={italic} toggleItalic={toggleItalic}
        shape={shape} changeShape={changeShape}
        createTable={createTable}
      />
      <div className="flex h-full">
        <Notes />
        <Canvas 
          mode={mode} changeMode={changeMode} 
          fontSize={fontSize} font={font} fontColor={fontColor}
          bold={bold} italic={italic} 
          shape={shape} 
          tableContent={tableContent}
          updateHistory={updateHistory}
        />
      </div>
    </div>
    
    </>
  )
}

export default App;
