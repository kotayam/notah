import { TextBoxProps } from "./Props";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { bindActionCreators } from "@reduxjs/toolkit";
import { actionCreators } from "./store/index.ts";

export default function TextBox({
  elt,
  selectTextBox,
  selectedElt,
}: TextBoxProps) {
  const dispatch = useDispatch();
  const { deleteCanvasElement } = bindActionCreators(actionCreators, dispatch);

  const [display, setDisplay] = useState("flex");
  let border = "border-0";
  if (selectedElt.id === elt.id) {
    border = "border-2";
  }
  // useEffect(() => {
  //   if (selectedElt.id === elt.id) {
  //     border = "border-2";
  //     setHidden(false);
  //   } else {
  //     setHidden(true);
  //   }
  // }, []);

  return (
    <>
      <div
        className="absolute hover:border-2"
        style={{ top: elt.y, left: elt.x }}
        onClick={(_) => {
          selectTextBox(elt);
        }}
        onMouseDown={(e) => e.stopPropagation()}
        onMouseEnter={(_) => {
          setDisplay("flex");
        }}
        onMouseLeave={(_) => {
          setDisplay("none");
        }}
      >
        <div
          style={{ display: display }}
          className="bg-gray-100 border-b-2 flex justify-between"
        >
          <button name="move-elt">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-5"
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
              className="h-5"
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
          contentEditable="true"
          key={elt.id}
          className={`min-w-[100px] ${border}`}
          style={{
            fontFamily: elt.font,
            fontSize: elt.fontSize,
            color: elt.fontColor,
          }}
        ></div>
      </div>
    </>
  );
}
