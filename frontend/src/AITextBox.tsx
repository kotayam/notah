import { CanvasElement } from "./Classes.ts";
import { AITextBoxProps } from "./Props.ts";
import { useEffect, useState, MouseEvent, FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "@reduxjs/toolkit";
import { actionCreators, rootState } from "./store/index.ts";
import DOMPurify from "isomorphic-dompurify";
import API from "./API.json";

const apiLink = API["isDev"] ? API["API"]["dev"] : API["API"]["production"];

export default function AITextBox({
  elt,
  selectAITextBox,
  selectedElt,
}: AITextBoxProps) {
  const account = useSelector((state: rootState) => state.account);
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
  const [visibility, setVisibility] = useState<"visible" | "hidden">("visible");
  const [drag, setDrag] = useState(false);
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    if (selectedElt.id === elt.id) {
      setBorder("border-2");
      setVisibility("visible");
    } else {
      setBorder("border-0");
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

  const deleteAITextBox = () => {
    if (!isSaved) {
      deleteCanvasElement(page.id, elt.id, elt);
      return;
    }
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
      .catch((e) => {
        console.error(e);
      });
  };

  const generateAnswer = (e: FormEvent) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      prompt: { value: string };
    };
    const prompt = target.prompt.value;
    console.log(prompt);
    fetch(apiLink + `CanvasElements/generateAnswer/${account.id}`, {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({prompt: prompt}),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setAnswer(data);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  return (
    <div
      className={`absolute ${border}`}
      style={{ top: elt.y - 26, left: elt.x }}
      onClick={(_) => {
        selectAITextBox(elt);
      }}
      onMouseDown={(e) => e.stopPropagation()}
      onMouseEnter={(_) => {
        if (visibility === "hidden") {
          setVisibility("visible");
          setBorder("border-2");
        }
      }}
      onMouseLeave={(_) => {
        if (selectedElt.id !== elt.id) {
          setBorder("border-0");
          setVisibility("hidden");
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
        <button name="delete-elt" onClick={() => deleteAITextBox()}>
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
        key={elt.id}
        className="grid-cols-1 place-content-center"
      >
        <div className="mb-2 p-1 max-w-[150px]">{answer}</div>
        <form
          className="grid-cols-1 place-content-center p-1"
          onSubmit={(e) => generateAnswer(e)}
        >
          <textarea
            name="prompt"
            placeholder="Enter prompt..."
            className="max-w-[150px] bg-gray-100 outline-none"
            onMouseDown={(_) => focus()}
          />
          <div className="grid grid-cols-2 gap-2 place-content-center">
            <button
              type="submit"
              className="p-1 rounded-md bg-gray-200 hover:bg-gray-300 active:bg-gray-400 font-semibold"
            >
              Generate
            </button>
            <button
              type="button"
              className="p-1 rounded-md bg-red-400 hover:bg-red-500 active:bg-red-600 font-semibold"
            >
              Stop
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
