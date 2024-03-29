import { TextBoxProps } from "./Props";
import { CanvasElement } from "./Classes.ts";
import { useEffect, useState, MouseEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "@reduxjs/toolkit";
import { actionCreators, rootState } from "./store/index.ts";
import DOMPurify from "isomorphic-dompurify";
import refreshToken from "./Authentication.ts";
import API from "./API.json";

const apiLink = API["isDev"] ? API["API"]["dev"] : API["API"]["production"];

export default function TextBox({
  elt,
  selectTextBox,
  selectedElt,
}: TextBoxProps) {
  const dispatch = useDispatch();
  const { deleteCanvasElement, updateCanvasElement, setSaved } =
    bindActionCreators(actionCreators, dispatch);
  let canvasElements = useSelector((state: rootState) => state.canvasElements);
  canvasElements = new Map(canvasElements);
  const page = useSelector((state: rootState) => state.page);
  const isSaved = useSelector((state: rootState) => state.isSaved);
  const [canvasElts, _] = useState(
    canvasElements.get(page.id) || new Array<CanvasElement>()
  );
  const [border, setBorder] = useState("border-0");
  const [outline, setOutline] = useState("outline-current");
  const [visibility, setVisibility] = useState<"visible" | "hidden">("visible");
  const [drag, setDrag] = useState(false);

  useEffect(() => {
    if (selectedElt.id === elt.id) {
      setBorder("border-2");
      setOutline("outline-none");
      setVisibility("visible");
    } else {
      setBorder("border-0");
      setOutline("outline-current");
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
    setDrag(false);
    setSaved(false);
  };

  const deleteTextBox = () => {
    if (!isSaved) {
      deleteCanvasElement(page.id, elt.id, elt);
      return;
    }
    fetch(apiLink + `CanvasElements/${elt.id}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((_) => {
        deleteCanvasElement(page.id, elt.id, elt);
      })
      .catch(async (_) => {
        const authorized = await refreshToken();
        if (authorized) {
          fetch(apiLink + `CanvasElements/${elt.id}`, {
            method: "DELETE",
            credentials: "include",
          })
            .then((res) => res.json())
            .then((_) => {
              deleteCanvasElement(page.id, elt.id, elt);
            })
            .catch((_) => {
              window.location.href = "/login?status=error";
            });
        }
      });
  };

  return (
    <>
      <div
        className={`absolute ${border}`}
        style={{ top: elt.y - 26, left: elt.x }}
        onClick={(_) => {
          selectTextBox(elt);
        }}
        onMouseDown={(e) => e.stopPropagation()}
        onMouseEnter={(_) => {
          if (visibility === "hidden") {
            setVisibility("visible");
            setBorder("border-2");
            setOutline("outline-none");
          }
        }}
        onMouseLeave={(_) => {
          if (selectedElt.id !== elt.id) {
            setBorder("border-0");
            setVisibility("hidden");
            setOutline("outline-current");
          }
        }}
      >
        <div
          className="bg-gray-100 border-b-2 flex justify-between"
          style={{ visibility: visibility }}
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
          <button name="delete-elt" onClick={() => deleteTextBox()}>
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
        <div
          id={elt.id}
          contentEditable="true"
          suppressContentEditableWarning
          key={elt.id}
          className={`min-w-[100px] ${outline}`}
          style={{
            fontFamily: elt.font,
            fontSize: elt.fontSize,
            color: elt.fontColor,
          }}
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(elt.innerHtml),
          }}
          onKeyDown={(_) => setSaved(false)}
        ></div>
      </div>
    </>
  );
}
