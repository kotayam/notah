import "./App.css";
import { useRef, useEffect, useState } from "react";
import { MouseEvent, KeyboardEvent } from "react";
import { CanvasElement, TextBoxElement, ShapeElement, TableElement } from "./Classes.ts";
import { CanvasProps } from "./Props.ts";
import TextBox from "./TextBox.tsx";
import Table from "./Table.tsx";
import Shape from "./Shape.tsx";

export default function Canvas({ mode, changeMode, fontSize, font, fontColor, bold, italic, shape, tableContent}: CanvasProps) {
    const [scale, setScale] = useState(window.devicePixelRatio);
    const [text, setText] = useState("");
    const [context, setContext] = useState<CanvasRenderingContext2D>();
    const [canvasElts, setCanvasElts] = useState<CanvasElement[]>([]);
    const [boldStatus, setBoldStatus] = useState(false);
    const [italicStatus, setItalicStatus] = useState(false);
    const [drawing, setDrawing] = useState(false);
    const [selectedElt, setSelectedElt] = useState({id: -1, r: -1, c: -1});

    // useEffect(() => {
    //     const handleResize = () => {
    //         setScale(window.devicePixelRatio);
    //     }
    //     window.addEventListener('resize', handleResize);
    //     return () => {window.removeEventListener('resize', handleResize)};
    // })

    const handleMouseDown = (e: MouseEvent, parent: HTMLDivElement) => {
        let newElt: CanvasElement;
        const x = (e.pageX - parent.offsetLeft);
        const y = (e.pageY - parent.offsetTop);
        if (mode === "text") {
            // setText("");
            const fontWeight = bold? 'bold' : 'normal';
            const fontStyle = italic? 'italic': 'normal';
            newElt = new TextBoxElement(canvasElts.length, x, y, "", font, fontSize, fontColor, fontWeight, fontStyle);
        } 
        else if (mode === "shape") {
            setDrawing(true);
            newElt = new ShapeElement(canvasElts.length, x, y, shape, 0, 0);
        }
        else if (mode === "table") {
            newElt = new TableElement(canvasElts.length, x, y, 2, 2, tableContent);
            changeMode('text');
        }
        setSelectedElt(prevState => {
            const newState = prevState;
            newState.id = canvasElts.length;
            return newState;
        });
        setCanvasElts(canvasElts => {
            return [...canvasElts, newElt];
        });
    }

    const handleMouseMove = (e: MouseEvent, parent: HTMLDivElement) => {
        if (!drawing) return;
        const x = (e.pageX - parent.offsetLeft);
        const y = (e.pageY - parent.offsetTop);
        // console.log(`x: ${x}, y: ${y}`);
        setCanvasElts(prevState => {
            const selected = prevState.filter(elt => elt.id === selectedElt.id)[0];
            const nonSelected = prevState.filter(elt => elt.id !== selectedElt.id);
            (selected as ShapeElement).width = x - selected.x;
            (selected as ShapeElement).height = y - selected.y;
            return [...nonSelected, selected];
        });
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
        setCanvasElts(prevState => {
            const selected = prevState.filter(elt => elt.id === selectedElt.id)[0];
            const nonSelected = prevState.filter(elt => elt.id !== selectedElt.id);
            if (selected instanceof TextBoxElement) {
                selected.content = txt;
            } 
            else if (selected instanceof TableElement) {
                selected.tableContent[selectedElt.r][selectedElt.c] = txt;
            }
            return [...nonSelected, selected];
        })
    }

    const returnCanvasElement = () => {
        const elts: JSX.Element[] = [];
        canvasElts.map(elt => {
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
                {returnCanvasElement()}
            </div>
        </div>
        </>
    );
}