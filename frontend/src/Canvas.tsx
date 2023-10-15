import "./App.css";
import { useRef, useEffect, useState } from "react";
import { MouseEvent, KeyboardEvent } from "react";
import { CanvasElement, TextBoxElement, ShapeElement, TableElement } from "./Classes.ts";
import { CanvasProps } from "./Props.ts";
import TextBox from "./TextBox.tsx";
import Table from "./Table.tsx";
import Shape from "./Shape.tsx";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "@reduxjs/toolkit";
import { actionCreators, rootState } from "./store/index.ts";
import parse from "html-react-parser";

const notahApi = "http://localhost:5245/api/v1/Pages/"

type Page = {
    html: string;
}

export default function Canvas() {
    const dispatch = useDispatch();
    const { addCanvasElement, deleteCanvasElement, updateCanvasElement } = bindActionCreators(actionCreators, dispatch);

    const canvasElements = useSelector((state: rootState) => state.canvasElements);
    const textStyle = useSelector((state: rootState) => state.textStyle);
    const shape = useSelector((state: rootState) => state.shape);
    const table = useSelector((state: rootState) => state.table);
    const mode = useSelector((state: rootState) => state.mode);
    const page = useSelector((state: rootState) => state.page);

    const [scale, setScale] = useState(window.devicePixelRatio);
    const [text, setText] = useState("");
    const [drawing, setDrawing] = useState(false);
    const [selectedElt, setSelectedElt] = useState({id: -1, r: -1, c: -1});
    const [initialLoad, setInitialLoad] = useState("");

    // useEffect(() => {
    //     const handleResize = () => {
    //         setScale(window.devicePixelRatio);
    //     }
    //     window.addEventListener('resize', handleResize);
    //     return () => {window.removeEventListener('resize', handleResize)};
    // })

    useEffect(() => {
        fetch(notahApi + page.id)
        .then(res => res.json())
        .then(data => data as Page)
        .then(data => {
            console.log(data);
            setInitialLoad(data.html);
        })
        .catch(e => console.error(e));
    }, [page])

    const handleMouseDown = (e: MouseEvent, parent: HTMLDivElement) => {
        let newElt: CanvasElement;
        const x = (e.pageX - parent.offsetLeft);
        const y = (e.pageY - parent.offsetTop);
        if (mode === "text") {
            // setText("");
            newElt = new TextBoxElement(canvasElements.length, x, y, "", textStyle.font, textStyle.fontSize, textStyle.fontColor, textStyle.fontWeight, textStyle.fontStyle);
        } 
        else if (mode === "shape") {
            setDrawing(true);
            newElt = new ShapeElement(canvasElements.length, x, y, shape, 0, 0);
        }
        else if (mode === "table") {
            const tableContent = new Array(table.row);
            tableContent.fill(new Array(table.col));
            for (let r = 0; r < tableContent.length; r++) {
                for (let c = 0; c < tableContent[r].length; c++) {
                    tableContent[r][c] = '';
                }
            }
            newElt = new TableElement(canvasElements.length, x, y, table.row, table.col, tableContent);
        }
        else {
            return;
        }
        addCanvasElement(newElt);
        setSelectedElt(prevState => {
            const newState = prevState;
            newState.id = canvasElements.length;
            return newState;
        });
        // setCanvasElts(canvasElts => {
        //     return [...canvasElts, newElt];
        // });
    }

    const handleMouseMove = (e: MouseEvent, parent: HTMLDivElement) => {
        if (!drawing) return;
        e.preventDefault();
        const x = (e.pageX - parent.offsetLeft);
        const y = (e.pageY - parent.offsetTop);
        // console.log(`x: ${x}, y: ${y}`);
        const tgt = canvasElements.filter(elt => elt.id === selectedElt.id)[0];
        const other = canvasElements.filter(elt => elt.id !== selectedElt.id);
        (tgt as ShapeElement).width = x - tgt.x;
        (tgt as ShapeElement).height = y - tgt.y;
        updateCanvasElement([...other, tgt]);
        // setCanvasElts(prevState => {
        //     const selected = prevState.filter(elt => elt.id === selectedElt.id)[0];
        //     const nonSelected = prevState.filter(elt => elt.id !== selectedElt.id);
        //     (selected as ShapeElement).width = x - selected.x;
        //     (selected as ShapeElement).height = y - selected.y;
        //     return [...nonSelected, selected];
        // });
    }

    const handleMouseUp = () => {
        setDrawing(false);
    }

    const selectTextBox = (elt: TextBoxElement) => {
        console.log(`text box: ${elt.id} selected.`);
        setText(elt.content);
        setSelectedElt(prevState => {
            const newState = prevState;
            newState.id = elt.id;
            return newState;
        });
    }

    const selectTableText = (elt: TableElement, row: number, col: number) => {
        console.log(`table: ${elt.id}, r: ${row}, c: ${col} selected.`);
        setText(elt.tableContent[row][col])
        setSelectedElt({id: elt.id, r: row, c: col});
    }

    const updateText = (newText: string) => {
        let txt = '';
        newText? txt = newText : txt = 'enter text';
        // setCanvasElts(prevState => {
        //     const selected = prevState.filter(elt => elt.id === selectedElt.id)[0];
        //     const nonSelected = prevState.filter(elt => elt.id !== selectedElt.id);
        //     if (selected instanceof TextBoxElement) {
        //         selected.content = txt;
        //     } 
        //     else if (selected instanceof TableElement) {
        //         selected.tableContent[selectedElt.r][selectedElt.c] = txt;
        //     }
        //     return [...nonSelected, selected];
        // })
    }

    const returnCanvasElement = () => {
        const elts: JSX.Element[] = [];
        canvasElements.map(elt => {
            if (elt instanceof TextBoxElement) {
                elts.push(<TextBox key={elt.id}  elt={elt} selectTextBox={selectTextBox} selectedElt={selectedElt} updateText={updateText}/>);
            }
            else if (elt instanceof ShapeElement) {
                elts.push(<Shape key={elt.id} elt={elt}/>)
            }
            else if (elt instanceof TableElement) {
                elts.push(<Table key={elt.id} elt={elt} selectTableText={selectTableText} selectedElt={selectedElt} updateText={updateText}/>);
            }
        })
        return elts;
    }

    const returnInitialLoad = () => {
        return initialLoad? parse(initialLoad): <></>;
    }

    return (
        <>
        <div 
        id="canvas-container"
        className="w-full h-screen overflow-scroll" 
        >
            <div
            id="canvas"
            className="w-full h-full relative" 
            onMouseDown={(e) => {handleMouseDown(e, e.currentTarget)}} 
            onMouseMove={(e) => {handleMouseMove(e, e.currentTarget)}}
            onMouseUp={_ => {handleMouseUp()}} 
            >
                {returnInitialLoad()}
                {returnCanvasElement()}
            </div>
        </div>
        </>
    );
}