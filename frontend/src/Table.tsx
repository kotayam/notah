import { TableProps } from "./Props.ts";
import { CanvasElement } from "./Classes.ts";
import TableRow from "./TableRow.tsx";
import { useState, useEffect, MouseEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "@reduxjs/toolkit";
import { actionCreators, rootState } from "./store/index.ts";
import API from "./API.json";

export default function Table({
  elt,
  selectTableText,
  selectedElt,
}: TableProps) {
  const dispatch = useDispatch();
  const { deleteCanvasElement, updateCanvasElement, setSaved } = bindActionCreators(
    actionCreators,
    dispatch
  );
  let canvasElements = useSelector((state: rootState) => state.canvasElements);
  canvasElements = new Map(canvasElements);
  const page = useSelector((state: rootState) => state.page);
  const [canvasElts, _] = useState(
    canvasElements.get(page.id) || new Array<CanvasElement>()
  );
  const [visibility, setVisibility] = useState<"visible" | "hidden">("visible");
  const [drag, setDrag] = useState(false);

  useEffect(() => {
    if (selectedElt.id === elt.id) {
      setVisibility("visible");
    } else {
      setVisibility("hidden");
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
    const curr = canvasElts.filter((ce) => elt.id === ce.id)[0];
    curr.x = newX;
    curr.y = newY + 26;
    updateCanvasElement(page.id, curr.id, curr);
  };

  const handleMouseUp = () => {
    setSaved(false);
    setDrag(false);
  };

  const deleteTable = () => {
    fetch(API["API"]["dev"] + `CanvasElements/${elt.id}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        deleteCanvasElement(page.id, elt.id, elt);
        setSaved(false);
      })
      .catch(e => {
        console.error(e);
      })
  };

  const returnTableRow = () => {
    let tbRow: JSX.Element[] = [];
    for (let r = 0; r < elt.row; r++) {
      tbRow.push(
        <TableRow
          key={r}
          rowId={r}
          elt={elt}
          selectTableText={selectTableText}
        />
      );
    }
    return tbRow;
  };

  return (
    <div
      className="absolute"
      style={{ top: elt.y - 26, left: elt.x }}
      onMouseDown={(e) => e.stopPropagation()}
      onMouseEnter={(_) => {
        if (visibility === "hidden") {
          setVisibility("visible");
        }
      }}
      onMouseLeave={(_) => {
        if (selectedElt.id !== elt.id) {
          setVisibility("hidden");
        }
      }}
    >
      <div
        style={{ visibility: visibility }}
        className="bg-gray-100 border-gray-800 border-[1px] border-b-0 flex justify-between"
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
        <button
          name="delete-elt"
          onClick={() => deleteTable()}
        >
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
      <table
        id={elt.id}
        className="border-gray-800 table-collapse table-auto text-left"
      >
        <tbody>{returnTableRow()}</tbody>
      </table>
    </div>
  );
}
