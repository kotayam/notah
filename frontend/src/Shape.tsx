import { ShapeProps } from "./Props.ts";
import { CanvasElement } from "./Classes.ts";
import { useState, useEffect, MouseEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "@reduxjs/toolkit";
import { actionCreators, rootState } from "./store/index.ts";
import DOMPurify from "isomorphic-dompurify";
import refreshToken from "./Authentication.ts";
import API from "./API.json";

const apiLink = API["isDev"] ? API["API"]["dev"] : API["API"]["production"];

type Line = {
  x1: string | number;
  y1: string | number;
  x2: string | number;
  y2: string | number;
};

export default function Shape({
  elt,
  selectShape,
  selectedElt,
  drawing,
}: ShapeProps) {
  const dispatch = useDispatch();
  const { deleteCanvasElement, updateCanvasElement, setSaved } =
    bindActionCreators(actionCreators, dispatch);
  let canvasElements = useSelector((state: rootState) => state.canvasElements);
  canvasElements = new Map(canvasElements);
  const page = useSelector((state: rootState) => state.page);
  const [canvasElts, _] = useState(
    canvasElements.get(page.id) || new Array<CanvasElement>()
  );
  const [border, setBorder] = useState("border-0");
  const [visibility, setVisibility] = useState<"visible" | "hidden">("visible");
  const [drag, setDrag] = useState(false);
  const [isEditable, setIsEditable] = useState(false);

  const dim = {
    x: elt.x,
    y: elt.y,
    width: Math.abs(elt.width),
    height: Math.abs(elt.height),
  };

  const line: Line = {
    x1: 0,
    y1: 0,
    x2: "100%",
    y2: "100%",
  };

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

  useEffect(() => {
    if (drawing) {
      setBorder("border-0");
      setVisibility("hidden");
    } else if (selectedElt.id === elt.id) {
      setBorder("border-2");
      setVisibility("visible");
    } else {
      setBorder("border-0");
      setVisibility("hidden");
    }
  }, [selectedElt.id]);

  const returnShape = () => {
    switch (elt.shape) {
      case "rect":
        return (
          <div
            id={elt.id}
            contentEditable={isEditable}
            className="relative bg-gray-100 border-2 border-black text-center outline-none"
            style={{
              width: dim.width,
              height: dim.height,
            }}
            onMouseDown={(e) => e.stopPropagation()}
            onMouseEnter={(_) => {
              setIsEditable(true);
            }}
            onMouseLeave={(_) => {
              setIsEditable(false);
            }}
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(elt.innerHtml),
            }}
          ></div>
        );
      case "circle":
        return (
          <div
            id={elt.id}
            contentEditable={isEditable}
            className="relative bg-gray-100 border-black border-2 text-center outline-none"
            style={{
              width: dim.width,
              height: dim.height,
              borderRadius: "50%",
            }}
            onMouseDown={(e) => e.stopPropagation()}
            onMouseEnter={(_) => {
              setIsEditable(true);
            }}
            onMouseLeave={(_) => {
              setIsEditable(false);
            }}
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(elt.innerHtml),
            }}
          ></div>
        );
      case "line":
        return (
          <svg
            id={elt.id}
            className="relative stroke-black"
            width={dim.width}
            height={dim.height}
          >
            <line x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} />
          </svg>
        );
    }
  };

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
    const curr = canvasElts.filter((ce) => elt.id === ce.id)[0];
    curr.x = newX;
    curr.y = newY + 26;
    updateCanvasElement(page.id, curr.id, curr);
  };

  const handleMouseUp = () => {
    setSaved(false);
    setDrag(false);
  };

  const deleteShape = () => {
    fetch(apiLink + `CanvasElements/${elt.id}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        deleteCanvasElement(page.id, elt.id, elt);
        setSaved(false);
      })
      .catch(async (_) => {
        const authorized = await refreshToken();
        if (authorized) {
          fetch(apiLink + `CanvasElements/${elt.id}`, {
            method: "DELETE",
            credentials: "include",
          })
            .then((res) => res.json())
            .then((data) => {
              console.log(data);
              deleteCanvasElement(page.id, elt.id, elt);
              setSaved(false);
            })
            .catch((_) => {
              window.location.href = "/login?status=error";
            });
        }
      });
  };

  return (
    <div
      className={`absolute border-dotted ${border}`}
      style={{ top: dim.y - 26, left: dim.x }}
      onClick={(_) => {
        selectShape(elt);
      }}
      onMouseDown={(e) => e.stopPropagation()}
      onMouseEnter={(_) => {
        if (drawing) {
          return;
        }
        if (visibility === "hidden") {
          setVisibility("visible");
          setBorder("border-2");
        }
      }}
      onMouseLeave={(e) => {
        e.preventDefault();
        if (selectedElt.id !== elt.id) {
          setBorder("border-0");
          setVisibility("hidden");
        }
      }}
    >
      <div
        style={{ visibility: visibility }}
        className="bg-gray-100 flex justify-between"
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
        <button name="delete-elt" onClick={() => deleteShape()}>
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
