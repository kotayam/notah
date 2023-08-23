import { NoteBookProps } from "./Props";
import { useDispatch, useSelector } from "react-redux";
import { actionCreators, rootState } from "./store";
import { bindActionCreators } from "@reduxjs/toolkit";
import { MouseEvent, KeyboardEvent, useState } from "react";

const notahApi = "http://localhost:5245/api/v1/NoteBooks/";

export default function NoteBook({ id, title }: NoteBookProps) {
  const noteBook = useSelector((state: rootState) => state.noteBook);
  const dispatch = useDispatch();
  const { setNoteBook } = bindActionCreators(actionCreators, dispatch);
  const [rename, setRename] = useState(false);
  const [ttl, setTtl] = useState(title);

  let hoverStyle = "hover:bg-gray-200";
  let bgStyle = "";
  if (noteBook.id === id) {
    hoverStyle = "";
    bgStyle = "bg-gray-300";
  }

  const handleClick = (e: MouseEvent) => {
    switch (e.button) {
      case 0:
        setNoteBook({ id: id, title: title });
        break;
      case 2:
        console.log("right click");
        setRename(true);
        break;
      default:
        return;
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      const input = document.getElementById(id) as HTMLInputElement;
      if (!input) return;
      fetch(notahApi + id, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: input.value }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setRename(false);
          setTtl(input.value);
        })
        .catch((e) => {
          console.error(e);
        });
    }
  };

  const returnNoteBook = () => {
    if (!rename) {
      return (
        <li
          className={`${hoverStyle} active:bg-gray-300 p-1 ${bgStyle}`}
          onClick={(e) => {
            handleClick(e);
          }}
          onContextMenu={(e) => {
            e.preventDefault();
            handleClick(e);
          }}
        >
          {ttl}
        </li>
      );
    } else {
      return (
        <li className={`p-1 ${bgStyle}`}>
          <input
            id={id}
            className="w-2/3"
            type="text"
            onKeyDown={(e) => handleKeyDown(e)}
            placeholder={ttl}
          />
        </li>
      );
    }
  };

  return <>{returnNoteBook()}</>;
}
