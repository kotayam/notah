import { ShapeProps } from "./Props.ts";
import { useState, useEffect, MouseEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "@reduxjs/toolkit";
import { actionCreators, rootState } from "./store/index.ts";

export default function Shape({ elt, selectShape, selectedElt }: ShapeProps) {
  const dispatch = useDispatch();
  const { deleteCanvasElement, updateCanvasElement } = bindActionCreators(
    actionCreators,
    dispatch
  );
  const canvasElements = useSelector(
    (state: rootState) => state.canvasElements
  );
  const [border, setBorder] = useState("border-0");
  const [display, setDisplay] = useState("flex");
  const [drag, setDrag] = useState(false);
  const [isEditable, setIsEditable] = useState(false);

  let dim = {
    x: elt.x,
    y: elt.y,
    width: Math.abs(elt.width),
    height: Math.abs(elt.height),
  };
  let line: any = { x1: 0, y1: 0, x2: "100%", y2: "100%" };

  if (elt.width < 0 && elt.height < 0) {
    dim.x += elt.width;
    dim.y += elt.height;
    line.x1 = "100%";
    line.y1 = "100%";
    line.x2 = 0;
    line.y2 = 0;
  } else if (elt.width < 0 && elt.height >= 0) {
    dim.x += elt.width;
    line.x1 = "100%";
    line.x2 = 0;
  } else if (elt.width >= 0 && elt.height < 0) {
    dim.y += elt.height;
    line.y1 = "100%";
    line.y2 = 0;
  }

  const returnShape = () => {
    switch (elt.shape) {
      case "rect":
        return (
          <div
            contentEditable={isEditable}
            className="relative bg-gray-100 border-2 border-black text-center"
            style={{
            //   top: dim.y,
            //   left: dim.x,
              width: dim.width,
              height: dim.height,
            }}
            onMouseDown={(e) => e.stopPropagation()}
            onMouseEnter={(e) => {
              e.stopPropagation();
              setIsEditable(true);
            }}
            onMouseLeave={(e) => {
              e.stopPropagation();
              setIsEditable(false);
            }}
          ></div>
        );
      case "circle":
        return (
          <div
            contentEditable={isEditable}
            className="relative bg-gray-100 border-black border-2 text-center"
            style={{
            //   top: dim.y,
            //   left: dim.x,
              width: dim.width,
              height: dim.height,
              borderRadius: "50%",
            }}
            onMouseDown={(e) => e.stopPropagation()}
            onMouseEnter={(e) => {
              e.stopPropagation();
              setIsEditable(true);
            }}
            onMouseLeave={(e) => {
              e.stopPropagation();
              setIsEditable(false);
            }}
          ></div>
        );
      case "line":
        return (
          <svg
            className="relative stroke-black"
            // style={{ top: dim.y, left: dim.x }}
            width={dim.width}
            height={dim.height}
          >
            <line x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} />
          </svg>
        );
    }
  };

  useEffect(() => {
    if (selectedElt.id === elt.id) {
      setBorder("border-2");
      setDisplay("flex");
    } else {
      setBorder("border-0");
      setDisplay("none");
    }
  }, [selectedElt.id]);

  const handleMouseDown = () => {
    setDrag(true);
  };

  const handleMouseMove = (e: MouseEvent, parent: HTMLButtonElement) => {
    e.preventDefault();
    if (!drag) return;
    const canvas = document.getElementById("canvas");
    if (!canvas) return;
    const midX = parent.offsetLeft + parent.offsetWidth / 2;
    const midY = parent.offsetTop + parent.offsetHeight / 2;
    const newX = e.pageX - midX - canvas.offsetLeft;
    const newY = e.pageY - midY - canvas.offsetTop;
    const curr = canvasElements.filter((ce) => elt.id === ce.id)[0];
    const other = canvasElements.filter((ce) => elt.id !== ce.id);
    curr.x = newX;
    curr.y = newY;
    updateCanvasElement([...other, curr]);
  };

  const handleMouseUp = () => {
    setDrag(false);
  };

  return (
    <div className="absolute" style={{top: dim.y, left:dim.x}}>
      <div
        style={{ display: display }}
        className="bg-gray-100 border-b-2 flex justify-between"
      >
        <button
          name="move-elt"
          onMouseDown={(_) => handleMouseDown()}
          onMouseMove={(e) => handleMouseMove(e, e.currentTarget)}
          onMouseUp={(_) => handleMouseUp()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-6"
          >
            <path d="M3 10a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM8.5 10a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM15.5 8.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
          </svg>
        </button>
        <button name="delete-elt" onClick={(_) => deleteCanvasElement(elt)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
      </div>
      {returnShape()}
    </div>
  );
}
