import "./App.css";
import { useState } from "react";
import Toolbar from "./Toolbar.tsx";
import Canvas from "./Canvas.tsx";
import Notes from "./Notes.tsx";
import { CanvasElement } from "./Classes.ts";

function App() {
  const [tableContent, setTableContent] = useState<string[][]>([])
  const [actionHistory, setActionHistory] = useState<CanvasElement[]>([]);

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
  }

  const updateHistory = (elts: CanvasElement[]) => {
    setActionHistory(elts);
  }

  return (
    <>
    <div>
      <Toolbar 
        createTable={createTable}
      />
      <div className="flex h-full">
        <Notes />
        <Canvas 
          tableContent={tableContent}
          updateHistory={updateHistory}
        />
      </div>
    </div>
    
    </>
  )
}

export default App;
