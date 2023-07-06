import "./App.css";
import { useState } from "react";
import Toolbar from "./Toolbar.tsx";
import Canvas from "./Canvas.tsx";

function App() {
  const [mode, setMode] = useState("");

  return (
    <>
    <Toolbar/>
    <Canvas mode={mode}/>
    </>
  )
}

export default App
