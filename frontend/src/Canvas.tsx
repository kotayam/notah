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

const notahApi = "http://localhost:5245/api/v1/CanvasElements/"

type CanvasElementDTO = {
    id: string;
    type: string;
    x: number;
    y: number;
    innerHtml: string;
    font: string;
    fontSize: number;
    fontColor: string;
    shape: string;
    width: number;
    height: number;
    row: number;
    column: number;
}

export default function Canvas() {
    const dispatch = useDispatch();
    const { addCanvasElement, updateCanvasElement, clearCanvasElements } = bindActionCreators(actionCreators, dispatch);

    let canvasElements = useSelector((state: rootState) => state.canvasElements);
    canvasElements = new Map(canvasElements);
    const textStyle = useSelector((state: rootState) => state.textStyle);
    const shape = useSelector((state: rootState) => state.shape);
    const table = useSelector((state: rootState) => state.table);
    const mode = useSelector((state: rootState) => state.mode);
    const page = useSelector((state: rootState) => state.page);

    const [scale, setScale] = useState(window.devicePixelRatio);
    const [text, setText] = useState("");
    const [drawing, setDrawing] = useState(false);
    const [selectedElt, setSelectedElt] = useState({id: "none", r: -1, c: -1});
    const [initialLoad, setInitialLoad] = useState("");

    // useEffect(() => {
    //     const handleResize = () => {
    //         setScale(window.devicePixelRatio);
    //     }
    //     window.addEventListener('resize', handleResize);
    //     return () => {window.removeEventListener('resize', handleResize)};
    // })

    useEffect(() => {
        fetch(notahApi + "byPageId/" + page.id)
        .then(res => res.json())
        .then(data => data as CanvasElementDTO[])
        .then(data => {
            console.log(data);
            clearCanvasElements(page.id);
            data.forEach(elt => {
                let newElt: CanvasElement;
                if (elt.type === "text") {
                    newElt = new TextBoxElement(elt.id, elt.x, elt.y, "", elt.font, elt.fontSize, elt.fontColor, textStyle.fontWeight, textStyle.fontStyle);
                }
                else if (elt.type === "shape") {
                    newElt = new ShapeElement(elt.id, elt.x, elt.y, elt.shape, elt.width, elt.height);
                }
                else if (elt.type === "table") {
                    newElt = new TableElement(elt.id, elt.x, elt.y, elt.row, elt.column);
                }
                else {
                    return;
                }
                addCanvasElement(page.id, newElt);
            })
        })
        .catch(e => console.error(e));
    }, [page])

    const handleMouseDown = (e: MouseEvent, parent: HTMLDivElement) => {
        let newElt: CanvasElement;
        const id = crypto.randomUUID();
        const x = (e.pageX - parent.offsetLeft);
        const y = (e.pageY - parent.offsetTop);
        if (mode === "text") {
            // setText("");
            newElt = new TextBoxElement(id, x, y, "", textStyle.font, textStyle.fontSize, textStyle.fontColor, textStyle.fontWeight, textStyle.fontStyle);
        } 
        else if (mode === "shape") {
            setDrawing(true);
            newElt = new ShapeElement(id, x, y, shape, 0, 0);
        }
        else if (mode === "table") {
            newElt = new TableElement(id, x, y, table.row, table.col);
        }
        else {
            return;
        }
        addCanvasElement(page.id, newElt);
        setSelectedElt(prevState => {
            const newState = prevState;
            newState.id = id;
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
        const ce = canvasElements.get(page.id);
        if (!ce) return;
        const tgt = ce.filter(elt => elt.id === selectedElt.id)[0];
        (tgt as ShapeElement).width = x - tgt.x;
        (tgt as ShapeElement).height = y - tgt.y;
        updateCanvasElement(page.id, selectedElt.id, tgt);
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

    const selectShape = (elt: ShapeElement) => {
        console.log(`shape: ${elt.id} selected.`);
        setSelectedElt(prev => {
            const newState = prev;
            newState.id = elt.id;
            return newState;
        })
    }

    const selectTableText = (elt: TableElement, row: number, col: number) => {
        console.log(`table: ${elt.id}, r: ${row}, c: ${col} selected.`);
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
        const ce = canvasElements.get(page.id);
        if (!ce) return;
        ce.map(elt => {
            if (elt instanceof TextBoxElement) {
                elts.push(<TextBox key={elt.id}  elt={elt} selectTextBox={selectTextBox} selectedElt={selectedElt} updateText={updateText}/>);
            }
            else if (elt instanceof ShapeElement) {
                elts.push(<Shape key={elt.id} elt={elt} selectShape={selectShape} selectedElt={selectedElt} drawing={drawing}/>)
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