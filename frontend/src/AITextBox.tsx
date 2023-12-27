import { CanvasElement } from "./Classes.ts";
import { AITextBoxProps } from "./Props.ts";
import { useEffect, useState, MouseEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "@reduxjs/toolkit";
import { actionCreators, rootState } from "./store/index.ts";
import DOMPurify from "isomorphic-dompurify";
import API from "./API.json";

const apiLink = API["isDev"] ? API["API"]["dev"] : API["API"]["production"];

export default function AITextBox({ elt }: AITextBoxProps) {
  return (
    <div
      className="absolute grid-cols-1 place-content-center border-2 p-1"
      style={{ top: elt.y - 26, left: elt.x }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className="text-center font-semibold border-b-2">AI</div>
      <div className="mb-2">Generated Text</div>
      <form action="post" className="grid-cols-1 place-content-center">
        <input type="text" placeholder="Enter prompt..." className="mb-2"/>
        <div className="grid grid-cols-2 gap-2 place-content-center">
          <button className="p-1 border-2 rounded-md">Generate</button>
          <button className="p-1 border-2 rounded-md">Stop</button>
        </div>
      </form>
    </div>
  );
}
