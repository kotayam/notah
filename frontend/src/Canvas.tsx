import "./App.css";
import { useRef, useEffect, useState } from "react";
import { MouseEvent, KeyboardEvent } from "react";
import { CanvasElement, TextBoxElement, ShapeElement, TableElement } from "./Classes.ts";
import { CanvasProps } from "./Props.ts";
import TextBox from "./TextBox.tsx";
import Table from "./Table.tsx";

export default function Canvas({ mode, fontSize, font, bold, italic, shape }: CanvasProps) {
    const [canvasRect, setCanvasRect] = useState({offsetLeft: 0, offsetTop: 0});
    const [scale, setScale] = useState(window.devicePixelRatio);
    const [text, setText] = useState("");
    const [context, setContext] = useState<CanvasRenderingContext2D>();
    const [canvasElts, setCanvasElts] = useState<CanvasElement[]>([]);
    const [boldStatus, setBoldStatus] = useState(false);
    const [italicStatus, setItalicStatus] = useState(false);
    const [drawing, setDrawing] = useState(false);
    const [selectedElt, setSelectedElt] = useState(-1);

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
                returnCanvasElement();
            }
            return () => {window.removeEventListener('resize', handleResize)};
        }
    })

    const handleMouseDown = (e: MouseEvent) => {
        let newElt: CanvasElement;
        const x = (e.pageX - canvasRect.offsetLeft) * scale;
        const y = (e.pageY - canvasRect.offsetTop) * scale;
        if (mode === "text") {
            setText("");
            const fontWeight = bold? 'bold' : 'normal';
            const fontStyle = italic? 'italic': 'normal';
            newElt = new TextBoxElement(canvasElts.length, x, y, true, "", font, fontSize, fontWeight, fontStyle);
        } 
        else if (mode === "shape") {
            setDrawing(true);
            newElt = new ShapeElement(canvasElts.length, x, y, true, shape, 0, 0);
        }
        else if (mode === "table") {
            newElt = new TableElement(canvasElts.length, x, y, true, 2, 2, [['test','test'],['test','test']]);
        }
        setSelectedElt(canvasElts.length);
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
            const selected = prevState.filter(elt => elt.id === selectedElt)[0];
            const nonSelected = prevState.filter(elt => elt.id !== selectedElt);
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
        setSelectedElt(elt.id);
        setCanvasElts(prevState => {
            const other = prevState.filter(e => e.id !== elt.id);
            const selected= prevState.filter(e => e.id === elt.id)[0];
            other.forEach(e => e.selected = false);
            selected.selected = true;
            return [...other, selected];
        })
    }

    const enterText = (e: KeyboardEvent) => {
        e.stopPropagation();
        const key = e.key;
        console.log(`key pressed: ${key}`);
        const k = key.toLowerCase();
        let newText = text;
        switch (k) {
            case ' ':
                if (text.charAt(text.length-1) !== ' ') newText += ' ';
                // newText += '\n&nbsp;\n'
                break;
            
            case 'enter':
                newText += '\n<br>\n'
                break;
            
            case 'backspace':
                const arr = text.split('\n');
                if (arr[arr.length - 1] === '') arr.pop();
                if (arr[arr.length-1] ===  '&nbsp;' || arr[arr.length-1] === '<br>' || arr[arr.length-1] === '<strong>') {
                    arr.pop();
                    newText = arr.join('\n');
                } else {
                    newText = text.substring(0, text.length-1);
                }
                break;
            
            default:
                if (k.length > 1) break;
                if (bold && !boldStatus) {
                    setBoldStatus(true);
                    newText += '\n<strong>';
                } else if (!bold && boldStatus) {
                    setBoldStatus(false);
                    newText += '\n';
                }
                newText += key;
                // if (bold && italic) {
                //     newText += '\n<span>\n' + key;
                // } else if (bold) {
                //     newText += '\n<strong>' + key;
                // } else if (italic) {
                //     newText += '\n<em>\n' + key;
                // } else {
                //     newText += key;
                // }
                break;
        }
        setText(newText);
        setCanvasElts(canvasElts => {
            const selected = (canvasElts.filter(elt => elt.id === selectedElt));
            const nonSelected = (canvasElts.filter(elt => elt.id !== selectedElt));
            (selected[0] as TextBoxElement).text = newText;
            return [...nonSelected, ...selected];
        });
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
                elts.push(<TextBox key={elt.id}  elt={elt as TextBoxElement} x={x} y={y} selectTextBox={selectTextBox}/>);
            }
            else if (elt instanceof ShapeElement) {
                drawShape(elt);
            }
            else if (elt instanceof TableElement) {
                elts.push(<Table key={elt.id} elt={elt as TableElement} x={x} y={y}/>);
            }
        })
        return elts;
    }

    return (
        <>
        <div 
        className="w-full" 
        tabIndex={0} 
        onKeyDown={(e) => {e.preventDefault(); enterText(e)}}
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