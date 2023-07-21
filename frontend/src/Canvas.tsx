import "./App.css";
import { useRef, useEffect, useState } from "react";
import { MouseEvent, KeyboardEvent } from "react";
import { CanvasElement, TextBoxElement, ShapeElement, TableElement } from "./Classes.ts";
import { CanvasProps } from "./Props.ts";
import TextBox from "./TextBox.tsx";
import Table from "./Table.tsx";

export default function Canvas({ mode, changeMode, fontSize, font, bold, italic, shape, headers, content }: CanvasProps) {
    const [canvasRect, setCanvasRect] = useState({offsetLeft: 0, offsetTop: 0});
    const [scale, setScale] = useState(window.devicePixelRatio);
    const [text, setText] = useState("");
    const [context, setContext] = useState<CanvasRenderingContext2D>();
    const [canvasElts, setCanvasElts] = useState<CanvasElement[]>([]);
    const [boldStatus, setBoldStatus] = useState(false);
    const [italicStatus, setItalicStatus] = useState(false);
    const [drawing, setDrawing] = useState(false);
    const [selectedElt, setSelectedElt] = useState({id: -1, r: -1, c: -1});

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (canvasRef.current) setCanvasRect({offsetLeft: canvasRef.current.offsetLeft, offsetTop: canvasRef.current.offsetTop});
    }, [])

    useEffect(() => {
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            const handleResize = () => {
                setCanvasRect({offsetLeft: canvas.offsetLeft, offsetTop: canvas.offsetTop});
                setScale(window.devicePixelRatio);
                console.log(`offsetLeft: ${canvas.offsetLeft}, offsetTop: ${canvas.offsetTop}`)
            }
            window.addEventListener('resize', handleResize);
            const ctx = canvas.getContext('2d');
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * scale;
            canvas.height = rect.height * scale;
            if (ctx) {
                setContext(ctx);
                // returnCanvasElement();
            }
            return () => {window.removeEventListener('resize', handleResize)};
        }
    })

    const handleMouseDown = (e: MouseEvent) => {
        let newElt: CanvasElement;
        const x = (e.pageX - canvasRect.offsetLeft) * scale;
        const y = (e.pageY - canvasRect.offsetTop) * scale;
        if (mode === "text") {
            // setText("");
            const fontWeight = bold? 'bold' : 'normal';
            const fontStyle = italic? 'italic': 'normal';
            newElt = new TextBoxElement(canvasElts.length, x, y, true, "", font, fontSize, fontWeight, fontStyle);
        } 
        else if (mode === "shape") {
            setDrawing(true);
            newElt = new ShapeElement(canvasElts.length, x, y, true, shape, 0, 0);
        }
        else if (mode === "table") {
            newElt = new TableElement(canvasElts.length, x, y, true, 2, 2, headers, content);
            changeMode('text');
        }
        setSelectedElt(prevState => {
            const newState = prevState;
            newState.id = canvasElts.length;
            return newState;
        });
        setCanvasElts(canvasElts => {
            canvasElts.forEach(elt => elt.selected = false);
            return [...canvasElts, newElt];
        });
    }

    const handleMouseMove = (e: MouseEvent) => {
        if (!drawing) return;
        const x = (e.pageX - canvasRect.offsetLeft) * scale;
        const y = (e.pageY - canvasRect.offsetTop) * scale;
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
        setText(elt.text);
        setSelectedElt(prevState => {
            const newState = prevState;
            newState.id = elt.id;
            return newState;
        });
    }

    const selectTableText = (elt: TableElement, row: number, col: number) => {
        console.log(`table: ${elt.id}, r: ${row}, c: ${col} selected.`);
        if (row === -1) {
            setText(elt.headers[col]);
        } else {
            setText(elt.content[row][col]);
        }
        setSelectedElt({id: elt.id, r: row, c: col});
    }

    // const enterText = (e: KeyboardEvent) => {
    //     e.stopPropagation();
    //     const key = e.key;
    //     console.log(`key pressed: ${key}`);
    //     const k = key.toLowerCase();
    //     let newText = text;
    //     switch (k) {
    //         case ' ':
    //             if (text.charAt(text.length-1) !== ' ') newText += ' ';
    //             // newText += '\n&nbsp;\n'
    //             break;
            
    //         case 'enter':
    //             newText += '\n<br>\n'
    //             break;
            
    //         case 'backspace':
    //             const arr = text.split('\n');
    //             if (arr[arr.length - 1] === '') arr.pop();
    //             if (arr[arr.length-1] ===  '&nbsp;' || arr[arr.length-1] === '<br>' || arr[arr.length-1] === '<strong>') {
    //                 arr.pop();
    //                 newText = arr.join('\n');
    //             } else {
    //                 newText = text.substring(0, text.length-1);
    //             }
    //             break;
            
    //         default:
    //             if (k.length > 1) break;
    //             if (bold && !boldStatus) {
    //                 setBoldStatus(true);
    //                 newText += '\n<strong>';
    //             } else if (!bold && boldStatus) {
    //                 setBoldStatus(false);
    //                 newText += '\n';
    //             }
    //             newText += key;
    //             // if (bold && italic) {
    //             //     newText += '\n<span>\n' + key;
    //             // } else if (bold) {
    //             //     newText += '\n<strong>' + key;
    //             // } else if (italic) {
    //             //     newText += '\n<em>\n' + key;
    //             // } else {
    //             //     newText += key;
    //             // }
    //             break;
    //     }
    //     setText(newText);
    //     setCanvasElts(canvasElts => {
    //         const selected = canvasElts.filter(elt => elt.id === selectedElt.id)[0];
    //         const nonSelected = canvasElts.filter(elt => elt.id !== selectedElt.id);
    //         if (selected instanceof TextBoxElement) {
    //             selected.text = newText;
    //         } 
    //         else if (selected instanceof TableElement) {
    //             if (selectedElt.r === -1) {
    //                 selected.headers[selectedElt.c] = newText;
    //             } 
    //             else {
    //                 selected.content[selectedElt.r][selectedElt.c] = newText;
    //             }
    //         }
    //         return [...nonSelected, selected];
    //     });
    // }

    const updateText = (newText: string) => {
        let txt = '';
        newText? txt = newText : txt = 'enter text';
        setCanvasElts(prevState => {
            const selected = prevState.filter(elt => elt.id === selectedElt.id)[0];
            const nonSelected = prevState.filter(elt => elt.id !== selectedElt.id);
            if (selected instanceof TextBoxElement) {
                selected.text = txt;
            } 
            else if (selected instanceof TableElement) {
                if (selectedElt.r === -1) {
                    selected.headers[selectedElt.c] = txt;
                } 
                else {
                    selected.content[selectedElt.r][selectedElt.c] = txt;
                }
            }
            return [...nonSelected, selected];
        })
    }

    const drawShape = (elt: ShapeElement) => {
        if (context) {
            switch (elt.shape) {
                case 'rect': 
                    context.strokeRect(elt.x, elt.y, elt.width, elt.height);
                    break;
                case 'circle':
                    const x = elt.x + elt.width / 2;
                    const y = elt.y + elt.height / 2;
                    context.beginPath();
                    context.ellipse(x, y, Math.abs(elt.width) / 2, Math.abs(elt.height) / 2, Math.PI, 0, 2 * Math.PI);
                    context.stroke();
                    break;
                case 'line':
                    context.beginPath();
                    context.moveTo(elt.x, elt.y);
                    context.lineTo(elt.x + elt.width, elt.y + elt.height);
                    context.stroke();
                    break;
            }
        } 
    }

    const returnCanvasElement = () => {
        const elts: JSX.Element[] = [];
        canvasElts.map(elt => {
            const x = elt.x + canvasRect.offsetLeft;
            const y = elt.y + canvasRect.offsetTop;
            if (elt instanceof TextBoxElement) {
                elts.push(<TextBox key={elt.id}  elt={elt as TextBoxElement} x={x} y={y} selectTextBox={selectTextBox} selectedElt={selectedElt} updateText={updateText}/>);
            }
            else if (elt instanceof ShapeElement) {
                drawShape(elt);
            }
            else if (elt instanceof TableElement) {
                elts.push(<Table key={elt.id} elt={elt as TableElement} x={x} y={y} selectTableText={selectTableText} selectedElt={selectedElt} updateText={updateText}/>);
            }
        })
        return elts;
    }

    return (
        <>
        <div 
        id="canvas-container"
        className="w-full" 
        // tabIndex={0} 
        //onKeyDown={(e) => {e.preventDefault(); enterText(e)}}
        >
            <canvas 
            className="bg-amber-50 w-full h-full" 
            ref={canvasRef} 
            onMouseDown={(e) => {handleMouseDown(e)}} 
            onMouseMove={(e) => {handleMouseMove(e)}}
            onMouseUp={_ => {handleMouseUp()}} 
            >
            </canvas>
            {returnCanvasElement()}
        </div>
        </>
    );
}