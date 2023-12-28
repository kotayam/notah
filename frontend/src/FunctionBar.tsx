import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { rootState } from "./store/index.ts";
import { bindActionCreators } from "@reduxjs/toolkit";
import { actionCreators } from "./store/index.ts";

export function TextFunctionBar() {
  const [colorClicked, setColorClicked] = useState(false);
  const [colorRect, setColorRect] = useState<DOMRect>();

  const textStyle = useSelector((state: rootState) => state.textStyle);
  const dispatch = useDispatch();
  const {
    changeFont,
    changeFontWeight,
    changeFontStyle,
    changeFontColor,
    changeFontSize,
  } = bindActionCreators(actionCreators, dispatch);

  const fonts = [
    "Sans-Serif",
    "Calibri",
    "Arial",
    "Times New Roman",
    "Georgia",
  ];
  const fontSizes = [11, 12, 16, 20, 24, 36, 48, 72];
  const textColors = ["black", "white", "red", "yellow", "green", "blue"];

  let boldStyle;
  if (textStyle.fontWeight === "bold") boldStyle = "bg-gray-300";
  else boldStyle = "bg-transparent";

  let italicStyle;
  if (textStyle.fontStyle === "italic") italicStyle = "bg-gray-300";
  else italicStyle = "bg-transparent";

  const showColorOption = () => {
    if (colorClicked && colorRect) {
      return (
        <>
          <div
            className="absolute border-[1px] bg-white p-2"
            style={{ top: colorRect.bottom, left: colorRect.left }}
          >
            <p>Font Color</p>
            <div className={`grid grid-cols-6 mobile:grid-cols-1 gap-1`}>
              {textColors.map((color, idx) => {
                return (
                  <div
                    key={`${idx}`}
                    className="border-[1px] h-8 mobile:h-6 w-8 mobile:w-6 hover:border-black z-[999]"
                    style={{ backgroundColor: color }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setColorClicked((prev) => !prev);
                      changeFontColor(color);
                    }}
                  ></div>
                );
              })}
            </div>
          </div>
        </>
      );
    }
  };

  return (
    <>
      <div className="flex justify-start items-center gap-2">
        <div className="flex items-center gap-1">
          <select
            className="hover:bg-gray-300 border-2 border-gray-300"
            value={textStyle.font}
            onChange={(e) => {
              changeFont(e.target.value);
            }}
            name="font"
            id="font"
          >
            {fonts.map((font, idx) => (
              <option key={idx} value={font.toLowerCase()}>
                {font}
              </option>
            ))}
          </select>
          <select
            className="hover:bg-gray-300 border-2 border-gray-300"
            value={textStyle.fontSize}
            onChange={(e) => {
              changeFontSize(parseInt(e.target.value));
            }}
            name="font-size"
            id="font-size"
          >
            {fontSizes.map((size, idx) => (
              <option key={idx} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-4 gap-3">
          <button
            className={`hover:bg-gray-300 active:bg-gray-400 rounded-none text-2xl mobile:text-xl ${boldStyle} pointer-events-none`}
            onClick={(_) => {
              if (textStyle.fontWeight === "bold") changeFontWeight("normal");
              else changeFontWeight("bold");
            }}
          >
            <strong className="">B</strong>
          </button>
          <button
            className={`hover:bg-gray-300 active:bg-gray-400 rounded-none text-2xl mobile:text-xl ${italicStyle} pointer-events-none`}
            onClick={(_) => {
              if (textStyle.fontStyle === "italic") changeFontStyle("normal");
              else changeFontStyle("italic");
            }}
          >
            <em className="" style={{ fontFamily: "georgia" }}>
              I
            </em>
          </button>
          <button
            className={`hover:bg-gray-300 active:bg-gray-400 rounded-none text-2xl mobile:text-xl pointer-events-none`}
          >
            <span className="underline">U</span>
          </button>
          <button
            className={`hover:bg-gray-300 active:bg-gray-400 rounded-none text-2xl mobile:text-xl`}
            onClick={(e) => {
              setColorClicked((prev) => !prev);
              setColorRect(e.currentTarget.getBoundingClientRect());
            }}
          >
            <div className="w-full h-full">
              <span
                className="h-7 underline decoration-4"
                style={{ textDecorationColor: textStyle.fontColor }}
              >
                A
              </span>
            </div>
          </button>
        </div>
        {showColorOption()}
      </div>
    </>
  );
}

export function ShapeFunctionBar() {
  const shape = useSelector((state: rootState) => state.shape);
  const dispatch = useDispatch();
  const { changeShape } = bindActionCreators(actionCreators, dispatch);

  const boldSelected = (thisShape: string) => {
    if (thisShape === shape) return "bold";
    return "normal";
  };

  const bgSelected = (thisShape: string) => {
    if (thisShape === shape) return "rgb(209 213 219)";
    return "";
  };

  return (
    <>
      <div className="flex justify-start items-center">
        <div className="grid grid-cols-3 gap-2 place-content-center">
          <button
            className="hover:bg-gray-300 active:bg-gray-400 border-1 flex justify-center items-center h-8 w-16"
            style={{
              fontWeight: boldSelected("rect"),
              backgroundColor: bgSelected("rect"),
            }}
            onClick={(_) => changeShape("rect")}
          >
            <div className="border-[1px] border-black bg-gray-100 w-8 h-5"></div>
          </button>
          <button
            className="hover:bg-gray-300 active:bg-gray-400 border-1 flex justify-center items-center"
            style={{
              fontWeight: boldSelected("circle"),
              backgroundColor: bgSelected("circle"),
            }}
            onClick={(_) => changeShape("circle")}
          >
            <div className="border-[1px] border-black bg-gray-100 w-5 h-5 rounded-full"></div>
          </button>
          <button
            className="hover:bg-gray-300 active:bg-gray-400 border-1 flex justify-center items-center"
            style={{
              fontWeight: boldSelected("line"),
              backgroundColor: bgSelected("line"),
            }}
            onClick={(_) => changeShape("line")}
          >
            <svg width={20} height={20} stroke="black">
              <line x1={0} y1={0} x2={"100%"} y2={"100%"}></line>
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}

export function TableFunctionBar() {
  const table = useSelector((root: rootState) => root.table);
  const dispatch = useDispatch();
  const { createTable } = bindActionCreators(actionCreators, dispatch);

  const [clicked, setClicked] = useState(false);
  const [rect, setRect] = useState<DOMRect>();
  const [gridCoord, setGridCoord] = useState({ r: -1, c: -1 });

  const ROW = 6;
  const COL = 6;

  const boldClicked = () => {
    if (clicked) return "bold";
    else return "normal";
  };

  const bgClicked = () => {
    if (clicked) return "rgb(209 213 219)";
    else return "";
  };

  const showTableOption = () => {
    if (clicked && rect) {
      const grid = new Array<string[]>(ROW);
      const rowContent = new Array(COL);
      rowContent.fill("");
      grid.fill(rowContent);

      return (
        <>
          <div
            className="absolute border-[1px] bg-white p-2 z-[999]"
            style={{ top: rect.bottom, left: rect.left }}
          >
            <p>{`${gridCoord.r + 1}*${gridCoord.c + 1} table`}</p>
            <div
              className={`grid gap-1`}
              style={{
                gridTemplateRows: `repeat(${ROW}, minmax(0, 1fr))`,
                gridTemplateColumns: `repeat(${COL}, minmax(0, 1fr))`,
              }}
            >
              {grid.map((r, rowId) => {
                return r.map((_, colId) => {
                  let bgColor = "bg-gray-100";
                  if (rowId <= gridCoord.r && colId <= gridCoord.c) {
                    bgColor = "bg-amber-200";
                  }
                  return (
                    <div
                      key={`${rowId}-${colId}`}
                      className={`border-[1px] h-8 w-8 ${bgColor}`}
                      onMouseEnter={(_) =>
                        setGridCoord((_) => {
                          return { r: rowId, c: colId };
                        })
                      }
                      onClick={(_) => {
                        setClicked((prev) => !prev);
                        createTable({ row: rowId + 1, col: colId + 1 });
                      }}
                    ></div>
                  );
                });
              })}
            </div>
          </div>
        </>
      );
    }
  };

  return (
    <>
      <div className="flex justify-start items-center">
        <button
          className="hover:bg-gray-300 active:bg-gray-400 border-[1px] rounded-md border-gray-500 py-1 px-2"
          style={{ fontWeight: boldClicked(), backgroundColor: bgClicked() }}
          onClick={(e) => {
            setClicked((prev) => !prev);
            setRect(e.currentTarget.getBoundingClientRect());
          }}
        >
          New
        </button>
        <div>
          <p className=" bg-gray-300 rounded-md p-1 ml-2 text-center">{`Creating ${table.row} * ${table.col} table`}</p>
        </div>
      </div>
      {showTableOption()}
    </>
  );
}

export function AIFunctionBar() {
  if (window.location.pathname === "/memo") {
    return (
      <div className="flex justify-start items-center">
        <a
          href="/signup"
          className="font-semibold text-blue-500 hover:underline"
        >
          Signup
        </a>
        &nbsp;or&nbsp;
        <a
          href="/login"
          className="font-semibold text-blue-500 hover:underline"
        >
          Login
        </a>
        &nbsp;to unlock AI feature!
      </div>
    );
  } else if (window.location.pathname === "/notah") {
    return (
      <div className="flex justify-start items-center gap-2">
        <p className="p-1">Click on your note to get started</p>
        <p className=" bg-gray-300 rounded-md p-1">{`Remaining Usage: ${10}`}</p>
      </div>
    );
  }
}
