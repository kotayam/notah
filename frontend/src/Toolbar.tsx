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
import { setNoteBook } from "./store/action-creators/noteBookActionCreator.ts";

const notahApi = "http://localhost:5245/api/v1/Pages/";

export default function Toolbar() {
  const mode = useSelector((state: rootState) => state.mode);
  const account = useSelector((state: rootState) => state.account);
  const page = useSelector((state: rootState) => state.page);

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
    const canvas = document.getElementById("canvas");
    if (!canvas) return;
    fetch(notahApi + page.id, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ html: canvas.innerHTML }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      })
      .catch((e) => {
        console.error(e);
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
          doc.save("note.pdf");
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

  const undo = () => {};

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
        <div className="relative bg-amber-400 h-10 text-center">
          <button
            className="float-left p-2 bg-amber-300"
            onClick={() => undo()}
          >
            Undo
          </button>
          <button
            className="float-left p-2 bg-amber-300"
            onClick={() => save()}
          >
            Save
          </button>
          <h1 className="font-bold">Notah</h1>
          {showLogButton()}
        </div>
        <div className="bg-gray-100 p-px">
          <ModeSelector thisMode={"Text"} />
          <ModeSelector thisMode={"Shape"} />
          <ModeSelector thisMode={"Table"} />
          <ModeSelector thisMode={"Draw"} />
          <button
            className="float-right h-full bg-gray-200 p-2"
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
