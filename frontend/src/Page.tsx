import { useDispatch, useSelector } from "react-redux";
import { PageProps } from "./Props";
import { actionCreators, rootState } from "./store";
import { bindActionCreators } from "@reduxjs/toolkit";

export default function Page({ id, title }: PageProps) {
    const page = useSelector((state: rootState) => state.page);
    const dispatch = useDispatch();
    const { setPage } = bindActionCreators(actionCreators, dispatch);

    let hoverStyle = "hover:bg-gray-200";
    let bgStyle = "";
    if (page.id === id) {
        hoverStyle = "";
        bgStyle = "bg-gray-300";
    }

    return (
        <>
        <li 
            key={id} 
            className={`${hoverStyle} active:bg-gray-300 p-1 ${bgStyle}`}
            onClick={() => setPage({id: id, title: title})}
            >{title}</li>
        </>
    )
}