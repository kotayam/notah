import "./App.css";
import React, { useState } from "react";
import Toolbar from "./Toolbar.tsx";
import Canvas from "./Canvas.tsx";

function App() {
  const [mode, setMode] = useState("text");
  const [fontSize, setFontSize] = useState(20);
  const [font, setFont] = useState("calibri");
  const [bold, setBold] = useState(false);

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
    if (isBold) {
      setBold(false);
      console.log(`Bold mode deactivated`);
    } else {
      setBold(true);
      console.log(`Bold mode activated`);
    }
}

  return (
    <>
    <Toolbar mode={mode} changeMode={changeMode} 
      fontSize={fontSize} changeFontSize={changeFontSize} 
      font={font} changeFont={changeFont} 
      bold={bold} toggleBold={toggleBold}/>
    <Canvas mode={mode} fontSize={fontSize} font={font} bold={bold}/>
    </>
  )
}

export default App
