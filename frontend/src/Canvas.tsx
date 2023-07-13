import "./App.css";
import { useRef, useEffect, useState } from "react";
import TextBox from "./TextBox";
import { CanvasElement, TextBoxElement, ShapeElement } from "./Classes.ts";
import { CanvasProps } from "./Props.ts";

export default function Canvas({ mode, fontSize, font, bold, italic }: CanvasProps) {
    const [text, setText] = useState("");
    const [context, setContext] = useState<CanvasRenderingContext2D>();
    const [canvasElts, setCanvasElts] = useState<CanvasElement[]>([]);
    const [boldStatus, setBoldStatus] = useState(false);
    const [italicStatus, setItalicStatus] = useState(false);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    let canvas: HTMLCanvasElement;
    let rect: DOMRect;
    // let scale: number;

    useEffect(() => {
        if (canvasRef.current) {
            canvas = canvasRef.current;
            canvas.focus();
            const ctx = canvas.getContext('2d');
            if (ctx) setContext(ctx);
            rect = canvas.getBoundingClientRect();
            // scale = window.devicePixelRatio;
            // canvas.width = rect.width * scale;
            // canvas.height = rect.height * scale;
            // if (ctx && pos.x > -1 && pos.y > -1) {
            //     draw(ctx);
            // }
        }
    })

    // const draw = (ctx: CanvasRenderingContext2D) => {
    //     console.log(canvasElts);
    //     canvasElts.forEach((elt, idx) => {
    //         ctx.font = `${elt.fontWeight} ${elt.fontStyle} ${elt.fontSize}px ${elt.font}`;
    //         const sentence = elt.text.split('\n');
    //         let boxWidth = -1;
    //         sentence.forEach((line, idx) => {
    //             if (ctx) {
    //                 ctx && ctx.fillText(line, elt.x, elt.y + elt.fontSize*idx);
    //                 if (ctx.measureText(line).width >= boxWidth) {
    //                     boxWidth = ctx.measureText(line).width;
    //                 }
    //             }
    //         });
    //         const boxHeight = elt.fontSize * (sentence.length + 1);
    //         if (idx === canvasElts.length-1) {
    //             ctx.strokeRect(elt.x, elt.y - elt.fontSize*1.5, boxWidth, boxHeight);
    //         }
    //     });
    // }

    const selectPos = (x: number, y: number) => {
        let newElt: CanvasElement;
        if (mode === "text") {
            setText("");
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            const coordX = (x - rect.left) * scaleX;
            const coordY = (y - rect.top) * scaleY;
            const fontWeight = bold? 'bold' : 'normal';
            const fontStyle = italic? 'italic': 'normal';
            newElt = new TextBoxElement(canvasElts.length, x, y, true, "", font, fontSize, fontWeight, fontStyle);
        } else if (mode === "shape") {
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            const coordX = (x - rect.left) * scaleX;
            const coordY = (y - rect.top) * scaleY;
            newElt = new ShapeElement(canvasElts.length, x, y, true, "rect", 100, 100);
        }
        setCanvasElts(canvasElts => {
            canvasElts.forEach(elt => elt.selected = false);
            return [...canvasElts, newElt];
        });
    }

    const enterText = (key: string) => {
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
            const selected = (canvasElts.filter(elt => elt.selected));
            const nonSelected = (canvasElts.filter(elt => !elt.selected));
            (selected[0] as TextBoxElement).text = newText;
            return [...nonSelected, ...selected];
        });
    }

    const selectText = (target: EventTarget & HTMLParagraphElement) => {
        console.log(target.innerHTML);
    }

    const drawShape = (elt: ShapeElement) => {
        console.log(context);
        if (context) context.fillRect(elt.x, elt.y, elt.width, elt.height);
    }

    const returnCanvasElement = () => {
        console.log(canvasElts);
        const elts: JSX.Element[] = [];
        canvasElts.map(elt => {
            if (elt instanceof TextBoxElement) {
                elts.push(<TextBox elt={elt as TextBoxElement}/>);
            }
            else if (elt instanceof ShapeElement) {
                drawShape(elt);
            }
        })
        return elts;
    }

    return (
        <>
        <div className="w-full">
            <canvas className="bg-amber-50 w-full h-full" ref={canvasRef} tabIndex={0} 
            onClick={(e) => {selectPos(e.clientX, e.clientY)}} onKeyDown={(e) => {e.preventDefault(); if (mode === 'text') enterText(e.key)}}>
            </canvas>
            {returnCanvasElement()}
        </div>
        </>
    );
}