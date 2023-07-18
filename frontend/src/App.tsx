import "./App.css";
import { useState } from "react";
import Toolbar from "./Toolbar.tsx";
import Canvas from "./Canvas.tsx";
import Notes from "./Notes.tsx";

function App() {
  const [mode, setMode] = useState("text");
  const [fontSize, setFontSize] = useState(20);
  const [font, setFont] = useState("calibri");
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [shape, setShape] = useState('rect');
  const [headers, setHeaders] = useState<string[]>([]);
  const [content, setContent] = useState<string[][]>([])

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
    const headers = new Array(col);
    for (let i = 0; i < headers.length; i++) {
      headers[i] = `header ${i}`;
    }
    setHeaders(headers);
    console.log(headers);
    const content = new Array(row-1);
    content.fill(new Array(col));
    for (let r = 0; r < content.length; r++) {
      for (let c = 0; c < content[r].length; c++) {
        content[r][c] = 'empty';
      }
    }
    setContent(content);
    console.log(content);
  }

  return (
    <>
    <div>
      <Toolbar mode={mode} changeMode={changeMode} 
        fontSize={fontSize} changeFontSize={changeFontSize} 
        font={font} changeFont={changeFont} 
        bold={bold} toggleBold={toggleBold}
        italic={italic} toggleItalic={toggleItalic}
        shape={shape} changeShape={changeShape}
        createTable={createTable}
        />
      <div className="flex h-full">
        <Notes />
        <Canvas mode={mode} fontSize={fontSize} font={font} bold={bold} italic={italic} shape={shape} headers={headers} content={content}/>
      </div>
    </div>
    
    </>
  )
}

export default App
