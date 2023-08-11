import { NoteBookProps } from "./Props";
import { useDispatch, useSelector } from "react-redux";
import { actionCreators, rootState } from "./store";
import { bindActionCreators } from "@reduxjs/toolkit";

export default function NoteBook({ id, title }: NoteBookProps) {
    const noteBook = useSelector((state: rootState) => state.noteBook);
    const dispatch = useDispatch();
    const { setNoteBook } = bindActionCreators(actionCreators, dispatch);

    let hoverStyle = "hover:bg-gray-200";
    let bgStyle = "";
    if (noteBook.id === id) {
        hoverStyle = "";
        bgStyle = "bg-gray-300";
    }

    return (
        <>
        <li 
            key={id} 
            className={`${hoverStyle} active:bg-gray-300 p-1 ${bgStyle}`}
            onClick={() => setNoteBook({id: id, title: title})}
        >{title}</li>
        </>
    )
}