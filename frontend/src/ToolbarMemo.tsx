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
import { useSelector } from "react-redux";
import { rootState } from "./store/index.ts";

export default function ToolbarMemo() {
  const mode = useSelector((state: rootState) => state.mode);

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
        <div className="flex justify-between items-center bg-gradient-to-br from-amber-400 via-amber-300 to-amber-400">
          <a href="/" className="flex justify-center items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              data-slot="icon"
              className="w-6 mobile:w-5 ml-2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
          </a>
          <a href="/">
            <h1 className=" font-semibold text-2xl mobile:text-xl">Notah</h1>
          </a>
          <div className="grid grid-cols-2 gap-3 mobile:gap-0">
            <a href="/signup" className="hover:underline">
              <div className="flex justify-center items-center">
                <h3>Sign Up</h3>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1"
                  stroke="currentColor"
                  className="w-5 mobile:w-4"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
                  />
                </svg>
              </div>
            </a>
            <a href="/login" className="hover:underline">
              <div className="flex justify-center items-center">
                <h3>Login</h3>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1"
                  stroke="currentColor"
                  className="w-5 mobile:w-4"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
                  />
                </svg>
              </div>
            </a>
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
              className=" h-full bg-gray-200 hover:bg-gray-300 active:bg-gray-400 p-2"
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
