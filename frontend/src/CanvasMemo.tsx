import "./App.css";
import { useState } from "react";
import { MouseEvent } from "react";
import {
  CanvasElement,
  TextBoxElement,
  ShapeElement,
  TableElement,
} from "./Classes.ts";
import TextBox from "./TextBox.tsx";
import Table from "./Table.tsx";
import Shape from "./Shape.tsx";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "@reduxjs/toolkit";
import { actionCreators, rootState } from "./store/index.ts";

export default function CanvasMemo() {
  const dispatch = useDispatch();
  const { addCanvasElement, updateCanvasElement } = bindActionCreators(
    actionCreators,
    dispatch
  );

  let canvasElements = useSelector((state: rootState) => state.canvasElements);
  canvasElements = new Map(canvasElements);
  const textStyle = useSelector((state: rootState) => state.textStyle);
  const shape = useSelector((state: rootState) => state.shape);
  const table = useSelector((state: rootState) => state.table);
  const mode = useSelector((state: rootState) => state.mode);
  const page = useSelector((state: rootState) => state.page);

  const [drawing, setDrawing] = useState(false);
  const [selectedElt, setSelectedElt] = useState({ id: "none", r: -1, c: -1 });

  const handleMouseDown = (e: MouseEvent, parent: HTMLDivElement) => {
    let newElt: CanvasElement;
    const id = crypto.randomUUID();
    const x = e.pageX - parent.offsetLeft;
    const y = e.pageY - parent.offsetTop;
    if (mode === "text") {
      newElt = new TextBoxElement(
        id,
        x,
        y,
        "",
        textStyle.font,
        textStyle.fontSize,
        textStyle.fontColor,
        textStyle.fontWeight,
        textStyle.fontStyle
      );
    } else if (mode === "shape") {
      setDrawing(true);
      newElt = new ShapeElement(id, x, y, "", shape, 0, 0);
    } else if (mode === "table") {
      newElt = new TableElement(id, x, y, "", table.row, table.col);
    } else {
      return;
    }
    addCanvasElement(page.id, newElt);
    setSelectedElt((prevState) => {
      const newState = prevState;
      newState.id = id;
      return newState;
    });
  };

  const handleMouseMove = (e: MouseEvent, parent: HTMLDivElement) => {
    if (!drawing) return;
    e.preventDefault();
    const x = e.pageX - parent.offsetLeft;
    const y = e.pageY - parent.offsetTop;
    const ce = canvasElements.get(page.id);
    if (!ce) return;
    const tgt = ce.filter((elt) => elt.id === selectedElt.id)[0];
    (tgt as ShapeElement).width = x - tgt.x;
    (tgt as ShapeElement).height = y - tgt.y;
    updateCanvasElement(page.id, selectedElt.id, tgt);
  };

  const handleMouseUp = () => {
    setDrawing(false);
  };

  const selectTextBox = (elt: TextBoxElement) => {
    setSelectedElt((prevState) => {
      const newState = prevState;
      newState.id = elt.id;
      return newState;
    });
  };

  const selectShape = (elt: ShapeElement) => {
    setSelectedElt((prev) => {
      const newState = prev;
      newState.id = elt.id;
      return newState;
    });
  };

  const selectTableText = (elt: TableElement, row: number, col: number) => {
    setSelectedElt({ id: elt.id, r: row, c: col });
  };

  const returnCanvasElement = () => {
    const elts: JSX.Element[] = [];
    const ce = canvasElements.get(page.id);
    if (!ce) return;
    ce.map((elt) => {
      if (elt instanceof TextBoxElement) {
        elts.push(
          <TextBox
            key={elt.id}
            elt={elt}
            selectTextBox={selectTextBox}
            selectedElt={selectedElt}
          />
        );
      } else if (elt instanceof ShapeElement) {
        elts.push(
          <Shape
            key={elt.id}
            elt={elt}
            selectShape={selectShape}
            selectedElt={selectedElt}
            drawing={drawing}
          />
        );
      } else if (elt instanceof TableElement) {
        elts.push(
          <Table
            key={elt.id}
            elt={elt}
            selectTableText={selectTableText}
            selectedElt={selectedElt}
          />
        );
      }
    });
    return elts;
  };

  return (
    <>
      <div
        id="canvas-container"
        className="h-screen w-full overflow-x-scroll overflow-y-hidden"
      >
        <div className="grid grid-cols-1">
          <div className="bg-amber-500 bg-opacity-40 w-full py-1 pointer-events-none">
            <p className="text-black text-lg mobile:text-sm animate-horizontalroll1 mobile:animate-horizontalroll2 whitespace-nowrap text-right">
              Currently in <span className="font-semibold">Memo Mode</span>.
              Sign Up and/or Login to save notes and unlock more features!
            </p>
          </div>
          <div
            id="canvas"
            className="h-screen relative"
            onMouseDown={(e) => {
              handleMouseDown(e, e.currentTarget);
            }}
            onMouseMove={(e) => {
              handleMouseMove(e, e.currentTarget);
            }}
            onMouseUp={(_) => {
              handleMouseUp();
            }}
          >
            <div className="pl-3 pt-2">
              <h3
                className="text-3xl mobile:text-xl underline underline-offset-8 decoration-gray-500 decoration-2 w-fit outline-none"
                onMouseDown={(e) => {
                  e.stopPropagation();
                }}
              >
                Memo
              </h3>
            </div>
            {returnCanvasElement()}
          </div>
        </div>
      </div>
    </>
  );
}
