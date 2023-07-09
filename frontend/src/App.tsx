import "./App.css";
import React, { useState } from "react";
import Toolbar from "./Toolbar.tsx";
import Canvas from "./Canvas.tsx";

function App() {
  const [mode, setMode] = useState("text");
  const [fontSize, setFontSize] = useState(20);
  const [font, setFont] = useState("calibri");
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);

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

  return (
    <>
    <Toolbar mode={mode} changeMode={changeMode} 
      fontSize={fontSize} changeFontSize={changeFontSize} 
      font={font} changeFont={changeFont} 
      bold={bold} toggleBold={toggleBold}
      italic={italic} toggleItalic={toggleItalic}/>
    <Canvas mode={mode} fontSize={fontSize} font={font} bold={bold} italic={italic}/>
    </>
  )
}

export default App
