import "./App.css";
import { useEffect, useState } from "react";
import { MouseEvent } from "react";
import {
  CanvasElement,
  TextBoxElement,
  ShapeElement,
  TableElement,
  AIElement,
} from "./Classes.ts";
import TextBox from "./TextBox.tsx";
import Table from "./Table.tsx";
import Shape from "./Shape.tsx";
import AITextBox from "./AITextBox.tsx";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "@reduxjs/toolkit";
import { actionCreators, rootState } from "./store/index.ts";
import API from "./API.json";
import refreshToken from "./Authentication.ts";

const apiLink = API["isDev"] ? API["API"]["dev"] : API["API"]["production"];

type CanvasElementDTO = {
  id: string;
  type: string;
  x: number;
  y: number;
  innerHTML: string;
  font: string;
  fontSize: number;
  fontColor: string;
  shape: string;
  width: number;
  height: number;
  row: number;
  column: number;
};

export default function Canvas() {
  const dispatch = useDispatch();
  const {
    addCanvasElement,
    updateCanvasElement,
    clearCanvasElements,
    setPage,
    setSaved,
  } = bindActionCreators(actionCreators, dispatch);

  let canvasElements = useSelector((state: rootState) => state.canvasElements);
  canvasElements = new Map(canvasElements);
  const textStyle = useSelector((state: rootState) => state.textStyle);
  const shape = useSelector((state: rootState) => state.shape);
  const table = useSelector((state: rootState) => state.table);
  const mode = useSelector((state: rootState) => state.mode);
  const page = useSelector((state: rootState) => state.page);

  const [drawing, setDrawing] = useState(false);
  const [selectedElt, setSelectedElt] = useState({ id: "none", r: -1, c: -1 });
  const [clickable, setClickable] = useState("");
  const [lastSaved, setLastSaved] = useState(page.lastSaved);

  useEffect(() => {
    page.id === "-1" ? setClickable("pointer-events-none") : setClickable("");
  }, [page.id]);

  useEffect(() => {
    setLastSaved(page.lastSaved);
  }, [page.lastSaved]);

  useEffect(() => {
    if (page.id === "-1") return;
    const addToList = (data: CanvasElementDTO[]) => {
      data.forEach((elt) => {
        let newElt: CanvasElement;
        switch (elt.type) {
          case "text":
            newElt = new TextBoxElement(
              elt.id,
              elt.x,
              elt.y,
              elt.innerHTML,
              elt.font,
              elt.fontSize,
              elt.fontColor,
              textStyle.fontWeight,
              textStyle.fontStyle
            );
            break;
          case "shape":
            newElt = new ShapeElement(
              elt.id,
              elt.x,
              elt.y,
              elt.innerHTML,
              elt.shape,
              elt.width,
              elt.height
            );
            break;
          case "table":
            newElt = new TableElement(
              elt.id,
              elt.x,
              elt.y,
              elt.innerHTML,
              elt.row,
              elt.column
            );
            break;
          case "ai":
            newElt = new AIElement(elt.id, elt.x, elt.y, elt.innerHTML);
            break;
          default:
            return;
        }
        addCanvasElement(page.id, newElt);
      });
    };

    fetch(apiLink + `CanvasElements/byPageId/${page.id}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => data as CanvasElementDTO[])
      .then((data) => {
        console.log(data);
        clearCanvasElements(page.id);
        addToList(data);
      })
      .catch(async (_) => {
        const authorized = await refreshToken();
        if (authorized) {
          fetch(apiLink + `CanvasElements/byPageId/${page.id}`, {
            credentials: "include",
          })
            .then((res) => res.json())
            .then((data) => data as CanvasElementDTO[])
            .then((data) => {
              console.log(data);
              clearCanvasElements(page.id);
              addToList(data);
            })
            .catch((_) => {
              window.location.href = "/login?status=error";
            });
        }
      });
  }, [page]);

  const handleMouseDown = (e: MouseEvent, parent: HTMLDivElement) => {
    let newElt: CanvasElement;
    const id = crypto.randomUUID();
    const x = e.pageX - parent.offsetLeft;
    const y = e.pageY - parent.offsetTop;
    switch (mode) {
      case "text":
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
        break;
      case "shape":
        setDrawing(true);
        newElt = new ShapeElement(id, x, y, "", shape, 0, 0);
        break;
      case "table":
        newElt = new TableElement(id, x, y, "", table.row, table.col);
        break;
      case "ai":
        newElt = new AIElement(id, x, y, "");
        break;
      default:
        return;
    }
    setSaved(false);
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
    console.log(`text box: ${elt.id} selected.`);
    setSelectedElt((prevState) => {
      const newState = prevState;
      newState.id = elt.id;
      return newState;
    });
  };

  const selectShape = (elt: ShapeElement) => {
    console.log(`shape: ${elt.id} selected.`);
    setSelectedElt((prev) => {
      const newState = prev;
      newState.id = elt.id;
      return newState;
    });
  };

  const selectTableText = (elt: TableElement, row: number, col: number) => {
    console.log(`table: ${elt.id}, r: ${row}, c: ${col} selected.`);
    setSelectedElt({ id: elt.id, r: row, c: col });
  };

  const selectAITextBox = (elt: AIElement) => {
    console.log(`AT text box: ${elt.id} selected.`);
    setSelectedElt((prevState) => {
      const newState = prevState;
      newState.id = elt.id;
      return newState;
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const div = document.getElementById("page-title");
    if (div === null) return;
    if (e.key === "Enter") {
      e.preventDefault();
      saveTitle(div);
    }
  };

  const saveTitle = (div: HTMLElement) => {
    if (div.innerText === page.title) return;
    fetch(apiLink + `Pages/${page.id}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: div.innerText }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setPage({
          id: data.id,
          title: data.title,
          dateCreated: data.dateCreated,
          lastSaved: data.lastSaved,
        });
      })
      .catch(async (_) => {
        const authorized = await refreshToken();
        if (authorized) {
          fetch(apiLink + `Pages/${page.id}`, {
            method: "PUT",
            credentials: "include",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ title: div.innerText }),
          })
            .then((res) => res.json())
            .then((data) => {
              console.log(data);
              setPage({
                id: data.id,
                title: data.title,
                dateCreated: data.dateCreated,
                lastSaved: data.lastSaved,
              });
            })
            .catch((_) => {
              window.location.href = "/login?status=error";
            });
        }
      });
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
      } else if (elt instanceof AIElement) {
        elts.push(
          <AITextBox
            key={elt.id}
            elt={elt}
            selectAITextBox={selectAITextBox}
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
        className={`w-full h-screen overflow-scroll ${clickable}`}
      >
        <div
          id="canvas"
          className="w-full h-full relative"
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
              id="page-title"
              suppressContentEditableWarning
              contentEditable="true"
              className="text-3xl mobile:text-xl underline underline-offset-8 decoration-gray-500 decoration-2 w-auto outline-none"
              onMouseDown={(e) => {
                e.stopPropagation();
              }}
              onKeyDown={(e) => handleKeyDown(e)}
              onMouseLeave={(_) => {
                const div = document.getElementById("page-title");
                if (div) saveTitle(div);
              }}
            >
              {page.id === "-1" ? "" : page.title}
            </h3>
            <p
              id="page-lastSaved"
              className="pt-2 text-gray-500"
              onMouseDown={(e) => e.stopPropagation()}
            >
              {page.id === "-1" ? "" : `Last Saved: ${lastSaved}`}
            </p>
          </div>
          {returnCanvasElement()}
        </div>
      </div>
    </>
  );
}
