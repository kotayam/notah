import "./App.css";
import ModeSelector from "./ModeSelector.tsx";
import {
  TextFunctionBar,
  ShapeFunctionBar,
  TableFunctionBar,
  AIFunctionBar,
} from "./FunctionBar.tsx";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { useDispatch, useSelector } from "react-redux";
import { actionCreators, rootState } from "./store/index.ts";
import { bindActionCreators } from "@reduxjs/toolkit";
import {
  AIElement,
  ShapeElement,
  TableElement,
  TextBoxElement,
} from "./Classes.ts";
import { useEffect, useState } from "react";
import refreshToken from "./Authentication.ts";
import API from "./API.json";

const apiLink = API["isDev"] ? API["API"]["dev"] : API["API"]["production"];

export default function Toolbar() {
  const mode = useSelector((state: rootState) => state.mode);
  const page = useSelector((state: rootState) => state.page);
  const isSaved = useSelector((state: rootState) => state.isSaved);
  const account = useSelector((state: rootState) => state.account);
  let canvasElements = useSelector((state: rootState) => state.canvasElements);
  canvasElements = new Map(canvasElements);

  const dispatch = useDispatch();
  const { setSaved, setPage } = bindActionCreators(actionCreators, dispatch);

  const [saveStatus, setSaveStatus] = useState("");
  const [clickable, setClickable] = useState("");

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
      case "ai":
        return <AIFunctionBar />;
    }
  };

  useEffect(() => {
    page.id === "-1" ? setClickable("pointer-events-none") : setClickable("");
    setSaved(true);
  }, [page.id]);

  const save = async () => {
    if (isSaved) return;
    const canvasElts = canvasElements.get(page.id);
    console.log(canvasElts);
    if (!canvasElts || canvasElts.length <= 0) {
      setSaved(true);
      return;
    }
    const authorized = await refreshToken();
    if (authorized) {
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
        } else if (elt instanceof AIElement) {
          body.type = "ai";
          body.innerHTML = innerHtml;
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
            if (data.status) {
              setSaveStatus("Failed to save");
              setTimeout(() => {
                setSaveStatus("Not saved");
              }, 3000);
              return;
            }
            setPage({
              id: data.pageId,
              title: data.title,
              dateCreated: data.dateCreated,
              lastSaved: data.lastSaved,
            });
            setSaved(true);
          })
          .catch((_) => {
            window.location.href = "/login?status=error";
          });
      });
    }
  };

  const logout = () => {
    if (!isSaved) {
      alert("Save before you logout");
      return;
    }
    fetch(apiLink + `Authentication/logout/${account.id}`, {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((data) => {
        console.log(data);
        if (data.status !== 200) {
          throw new Error();
        }
        window.location.href = "/";
      })
      .catch(async (_) => {
        const authorized = await refreshToken();
        if (authorized) {
          fetch(apiLink + `Authentication/logout/${account.id}`, {
            method: "POST",
            credentials: "include",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          })
            .then((data) => {
              console.log(data);
              if (data.status !== 200) {
                throw new Error();
              }
              window.location.href = "/";
            })
            .catch((_) => {
              window.location.href = "/login?status=error";
            });
        }
      });
  };

  const saveAsPdf = async () => {
    const container = document.getElementById("canvas");
    if (container) {
      const canvas = await html2canvas(container);
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const width = pdf.internal.pageSize.getWidth();
      const height = pdf.internal.pageSize.getHeight();
      const scale = Math.min(width / canvas.width, height / canvas.height);
      pdf.addImage(
        imgData,
        "PNG",
        15,
        15,
        canvas.width * scale,
        canvas.height * scale
      );
      pdf.save("Memo");
    }
  };

  return (
    <>
      <div className="w-full border-b-2">
        <div className="flex justify-between items-center bg-gradient-to-br from-amber-400 via-amber-300 to-amber-400 px-2">
          <div className="flex justify-center items-center gap-1">
            <button
              className={`p-2 mobile:p-1 hover:bg-amber-200 active:bg-amber-100 ${clickable}`}
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
            <a
              href="/account"
              className="hover:underline hover:bg-amber-200 p-2 mobile:p-1"
            >
              <div className="flex justify-center items-center">
                <h3>Account</h3>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1"
                  stroke="currentColor"
                  className="w-5 mobile:w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
                  />
                </svg>
              </div>
            </a>
            <button
              className="hover:underline hover:bg-amber-200 p-2 mobile:p-1"
              onClick={() => logout()}
            >
              <div className="flex justify-center items-center">
                <h3>Logout</h3>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1"
                  stroke="currentColor"
                  className="w-5 mobile:w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
                  />
                </svg>
              </div>
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
              className={`h-full bg-gray-200 hover:bg-gray-300 active:bg-gray-400 p-2 ${clickable}`}
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
