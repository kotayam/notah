import "./App.css";
import { useState } from "react";
import Toolbar from "./Toolbar.tsx";
import Canvas from "./Canvas.tsx";
import Notes from "./Notes.tsx";
import { CanvasElement } from "./Classes.ts";

function App() {
  return (
    <>
    <div>
      <Toolbar />
      <div className="flex h-full">
        <Notes />
        <Canvas />
      </div>
    </div>
    
    </>
  )
}

export default App;
