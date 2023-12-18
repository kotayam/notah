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
            <div
              className={`grid gap-1`}
              style={{
                gridTemplateRows: `repeat(${1}, minmax(0, 1fr))`,
                gridTemplateColumns: `repeat(${textColors.length}, minmax(0, 1fr))`,
              }}
            >
              {textColors.map((color, idx) => {
                return (
                  <div
                    key={`${idx}`}
                    className="border-[1px] h-8 w-8 hover:border-black z-[999]"
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
      <select
        className="hover:bg-gray-300 border-2 border-r-0 border-gray-300 text-[18px]"
        value={textStyle.font}
        onChange={(e) => {
          changeFont(e.target.value);
        }}
        name="font"
        id="font"
      >
        <option value="sans-serif">Sans-Serif</option>
        <option value="calibri">Calibri</option>
        <option value="arial">Arial</option>
        <option value="times-new-roman">Times New Roman</option>
        <option value="georgia">Georgia</option>
      </select>
      <select
        className="hover:bg-gray-300 border-2 border-gray-300 text-[18px]"
        value={textStyle.fontSize}
        onChange={(e) => {
          changeFontSize(parseInt(e.target.value));
        }}
        name="font-size"
        id="font-size"
      >
        <option value="11">11</option>
        <option value="12">12</option>
        <option value="16">16</option>
        <option value="20">20</option>
        <option value="24">24</option>
        <option value="36">36</option>
        <option value="48">48</option>
        <option value="72">72</option>
      </select>
      <button
        className={`hover:bg-gray-300 active:bg-gray-400 text-[25px] w-[30px] rounded-none ${boldStyle}`}
        onClick={(_) => {
          if (textStyle.fontWeight === "bold") changeFontWeight("normal");
          else changeFontWeight("bold");
        }}
      >
        <strong>B</strong>
      </button>
      <button
        className={`hover:bg-gray-300 active:bg-gray-400 text-[25px] w-[30px] rounded-none ${italicStyle}`}
        onClick={(_) => {
          if (textStyle.fontStyle === "italic") changeFontStyle("normal");
          else changeFontStyle("italic");
        }}
      >
        <em style={{ fontFamily: "georgia" }}>I</em>
      </button>
      <button
        className={`hover:bg-gray-300 active:bg-gray-400 text-[25px] w-[30px] rounded-none`}
      >
        <span className="underline">U</span>
      </button>
      <button
        className={`hover:bg-gray-300 active:bg-gray-400 text-[21px] w-[30px] rounded-none`}
        onClick={(e) => {
          setColorClicked((prev) => !prev);
          setColorRect(e.currentTarget.getBoundingClientRect());
        }}
      >
        <div className="w-full h-full">
          <p className="h-7">A</p>
          <div
            className="h-1 w-5 m-auto"
            style={{ backgroundColor: textStyle.fontColor }}
          ></div>
        </div>
      </button>
      {showColorOption()}
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
      <button
        className="hover:bg-gray-300 active:bg-gray-400 border-1 py-1 px-6 h-10"
        style={{
          fontWeight: boldSelected("rect"),
          backgroundColor: bgSelected("rect"),
        }}
        onClick={(_) => changeShape("rect")}
      >
        <div className="border-[1px] border-black bg-gray-100 w-8 h-5"></div>
      </button>
      <button
        className="hover:bg-gray-300 active:bg-gray-400 border-1 py-2 px-6 h-10"
        style={{
          fontWeight: boldSelected("circle"),
          backgroundColor: bgSelected("circle"),
        }}
        onClick={(_) => changeShape("circle")}
      >
        <div className="border-[1px] border-black bg-gray-100 w-5 h-5 rounded-full"></div>
      </button>
      <button
        className="hover:bg-gray-300 active:bg-gray-400 border-1 py-2 px-6 h-10"
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
    </>
  );
}

export function TableFunctionBar() {
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
            className="absolute border-[1px] bg-white p-2"
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
      <button
        className="hover:bg-gray-300 active:bg-gray-400 border-[1px] border-gray-500 py-1 px-2"
        style={{ fontWeight: boldClicked(), backgroundColor: bgClicked() }}
        onClick={(e) => {
          setClicked((prev) => !prev);
          setRect(e.currentTarget.getBoundingClientRect());
        }}
      >
        New
      </button>
      {showTableOption()}
    </>
  );
}
