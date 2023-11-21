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

const notahApi = "http://localhost:5245/api/v1/CanvasElements/";

export default function Toolbar() {
  const mode = useSelector((state: rootState) => state.mode);
  const account = useSelector((state: rootState) => state.account);
  const page = useSelector((state: rootState) => state.page);
  let canvasElements = useSelector(
    (state: rootState) => state.canvasElements
  );
  canvasElements = new Map(canvasElements);

  const dispatch = useDispatch();
  const { setAccount, setNoteBook } = bindActionCreators(
    actionCreators,
    dispatch
  );

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
    const canvasElts = canvasElements.get(page.id);
    if (!canvasElts) return;
    console.log(canvasElts);
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
        column: 0
      }
      const div = document.getElementById(elt.id);
      const innerHtml = div?.innerHTML || "";
      if (elt instanceof TextBoxElement) {
        body.type = "text";
        body.innerHTML = innerHtml;
        body.font = elt.font;
        body.fontSize = elt.fontSize;
        body.fontColor = elt.fontColor;
      }
      else if (elt instanceof ShapeElement) {
        body.type = "shape";
        body.innerHTML = innerHtml;
        body.shape = elt.shape;
        body.width = elt.width;
        body.height = elt.height
      }
      else if (elt instanceof TableElement) {
        body.type = "table";
        body.innerHTML = innerHtml;
        body.row = elt.row;
        body.column = elt.col
      }
      fetch(notahApi + page.id, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
        })
        .catch((e) => {
          console.error(e);
        });
    });
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

  const showLogButton = () => {
    if (account.id == "0") {
      return (
        <a href="/login">
          <button className="absolute p-2 right-0 top-0 bg-amber-300">
            Login
          </button>
        </a>
      );
    } else {
      return (
        <a href="/login">
          <button
            className="absolute p-2 right-0 top-0 bg-amber-300"
            onClick={() => {
              setAccount({ id: "0", fullName: "Guest" });
              setNoteBook({ id: "0", title: "Temp" });
            }}
          >
            Logout
          </button>
        </a>
      );
    }
  };

  return (
    <>
      <div className="w-full border-b-2">
        <div className="flex justify-between items-enter bg-amber-400">
          <div>
            <button className="p-2 bg-amber-300" onClick={() => save()}>
              Save
            </button>
          </div>
          <h1 className=" font-semibold text-2xl">Notah</h1>
          {showLogButton()}
        </div>
        <div className="flex justify-between items-enter bg-gray-100">
          <div className="">
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

        <div className="bg-gray-100 h-10 px-4">{returnFunctionBar()}</div>
      </div>
    </>
  );
}
