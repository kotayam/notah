import "./App.css";
import ModeSelector from "./ModeSelector.tsx";
import {
  TextFunctionBar,
  ShapeFunctionBar,
  TableFunctionBar,
} from "./FunctionBar.tsx";
import { jsPDF } from "jspdf";
import { useDispatch, useSelector } from "react-redux";
import { actionCreators, rootState } from "./store/index.ts";
import { bindActionCreators } from "@reduxjs/toolkit";
import { ShapeElement, TableElement, TextBoxElement } from "./Classes.ts";
import { useEffect, useState } from "react";
import API from "./API.json";

const apiLink = API["isDev"]? API["API"]["dev"] : API["API"]["production"];

export default function Toolbar() {
  const mode = useSelector((state: rootState) => state.mode);
  const page = useSelector((state: rootState) => state.page);
  const isSaved = useSelector((state: rootState) => state.isSaved);
  let canvasElements = useSelector((state: rootState) => state.canvasElements);
  canvasElements = new Map(canvasElements);

  const dispatch = useDispatch();
  const { setSaved } = bindActionCreators(actionCreators, dispatch);

  const [saveStatus, setSaveStatus] = useState("");

  useEffect(() => {
    if (isSaved) setSaveStatus("Work saved");
    else setSaveStatus("Not saved");
  }, [isSaved]);

  const returnFunctionBar = () => {
    switch (mode) {
      case "text":
        return <TextFunctionBar />;
      case "shape":
        return <ShapeFunctionBar />;
      case "table":
        return <TableFunctionBar />;
    }
  };

  const save = () => {
    if (isSaved) return;
    const canvasElts = canvasElements.get(page.id);
    console.log(canvasElts);
    if (!canvasElts || canvasElts.length <= 0) {
      setSaved(true);
      return;
    }
    canvasElts.forEach((elt) => {
      const body = {
        id: elt.id,
        type: "",
        x: elt.x,
        y: elt.y,
        innerHTML: "",
        font: "",
        fontSize: 0,
        fontColor: "",
        shape: "",
        width: 0,
        height: 0,
        row: 0,
        column: 0,
      };
      const div = document.getElementById(elt.id);
      const innerHtml = div?.innerHTML || "";
      if (elt instanceof TextBoxElement) {
        body.type = "text";
        body.innerHTML = innerHtml;
        body.font = elt.font;
        body.fontSize = elt.fontSize;
        body.fontColor = elt.fontColor;
      } else if (elt instanceof ShapeElement) {
        body.type = "shape";
        body.innerHTML = innerHtml;
        body.shape = elt.shape;
        body.width = elt.width;
        body.height = elt.height;
      } else if (elt instanceof TableElement) {
        body.type = "table";
        body.innerHTML = innerHtml;
        body.row = elt.row;
        body.column = elt.col;
      }
      setSaveStatus("Saving...");
      fetch(apiLink + `CanvasElements/${page.id}`, {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setSaved(true);
        })
        .catch((e) => {
          console.error(e);
          setSaveStatus("Failed to save");
          setTimeout(() => {
            setSaveStatus("Not saved");
          }, 3000);
        });
    });
  };

  const logout = () => {
    if (!isSaved) {
      alert("Save before you logout");
      return;
    }
    fetch(apiLink + "Authentication/logout", {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
    .then(_ => {
      window.location.href = "/";
    })
    .catch(_ => {
      console.error("failed to logout")
    })
  };

  const saveAsPdf = async () => {
    const note = document.getElementById("canvas-container");
    if (note) {
      const rect = note.getBoundingClientRect();
      // const canvas = await html2canvas(note, {scale: 2, width: rect.width, height: rect.height});
      const pdf = new jsPDF("p", "mm", "a4");
      const width = pdf.internal.pageSize.getWidth();
      pdf.html(note, {
        callback: function (doc) {
          // Save the PDF
          doc.save(page.title);
        },
        x: 15,
        y: 15,
        width: width,
        windowWidth: rect.width,
      });
      // pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, width, height);
      // pdf.save('note');
    }
  };

  return (
    <>
      <div className="w-full border-b-2">
        <div className="flex justify-between items-center bg-gradient-to-br from-amber-400 via-amber-300 to-amber-400 px-2">
          <div className="flex justify-center items-center gap-1">
            <button
              className="p-2 mobile:p-1 hover:bg-amber-200 active:bg-amber-100"
              onClick={() => save()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                className="w-6 h-6 mobile:w-4"
              >
                <path d="M433.9 129.9l-83.9-83.9A48 48 0 0 0 316.1 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V163.9a48 48 0 0 0 -14.1-33.9zM272 80v80H144V80h128zm122 352H54a6 6 0 0 1 -6-6V86a6 6 0 0 1 6-6h42v104c0 13.3 10.7 24 24 24h176c13.3 0 24-10.7 24-24V83.9l78.2 78.2a6 6 0 0 1 1.8 4.2V426a6 6 0 0 1 -6 6zM224 232c-48.5 0-88 39.5-88 88s39.5 88 88 88 88-39.5 88-88-39.5-88-88-88zm0 128c-22.1 0-40-17.9-40-40s17.9-40 40-40 40 17.9 40 40-17.9 40-40 40z" />
              </svg>
            </button>
            <p className=" text-gray-800">{saveStatus}</p>
          </div>
          <h1 className=" font-semibold text-2xl mobile:text-xl">Notah</h1>
          <div className="flex justify-center items-center">
            <button className="hover:underline hover:bg-amber-200 p-2 mobile:p-1">
              Account
            </button>
            <button
              className="hover:underline hover:bg-amber-200 p-2 mobile:p-1"
              onClick={() => logout()}
            >
              Logout
            </button>
          </div>
        </div>
        <div className=" bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <ModeSelector thisMode={"Text"} />
              <ModeSelector thisMode={"Shape"} />
              <ModeSelector thisMode={"Table"} />
              <ModeSelector thisMode={"AI"} />
            </div>
            <button
              className=" h-full bg-gray-200 p-2"
              onClick={(_) => saveAsPdf()}
            >
              Save as PDF
            </button>
          </div>
          <div className="h-10 px-4">{returnFunctionBar()}</div>
        </div>
      </div>
    </>
  );
}
