import "./App.css";
import { useRef, useEffect, useState } from "react";

type CanvasProps = {
    mode: string;
    fontSize: number;
    font: string;
    bold: boolean;
    italic: boolean;
}

type CanvasElement = {
    text: string;
    x: number;
    y: number;
    width: number;
    height: number;
    font: string;
    fontSize: number;
    fontWeight: string;
    fontStyle: string;
    selected: boolean;
}

export default function Canvas({ mode, fontSize, font, bold, italic }: CanvasProps) {
    const [pos, setPos] = useState({x: -1, y: -1});
    const [text, setText] = useState("");
    const [canvasElts, setCanvasElts] = useState<CanvasElement[]>([]);
    const [boldStatus, setBoldStatus] = useState(false);
    const [italicStatus, setItalicStatus] = useState(false);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    let canvas: HTMLCanvasElement;
    let rect: DOMRect;
    let ctx: CanvasRenderingContext2D | null;
    // let scale: number;

    useEffect(() => {
        if (canvasRef.current) {
            canvas = canvasRef.current;
            canvas.focus();
            ctx = canvas.getContext('2d');
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

    const clickedBox = (x: number, y: number, elt: CanvasElement) => {
        return x >= elt.x && x <= elt.x + elt.width && y >= (elt.y-elt.fontSize*1.5) && y <= (elt.y-elt.fontSize*1.5+elt.height);
    }

    const selectPos = (x: number, y: number) => {
        // canvasElts.forEach((elt, idx) => {
        //     if (clickedBox(x, y, elt)) {
        //         setText(elt.text);
        //         setCanvasElts(canvasElts => {
        //             const elts = canvasElts.filter((e, i) => i !== idx);
        //             return [...elts, elt];
        //         });
        //         return;
        //     }
        // });
        setText("");
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const coordX = (x - rect.left) * scaleX;
        const coordY = (y - rect.top) * scaleY;
        const fontWeight = bold? 'bold' : 'normal';
        const fontStyle = italic? 'italic': 'normal'
        setPos({x: coordX, y: coordY});
        setCanvasElts(canvasElts => {
            canvasElts.forEach(elt => elt.selected = false);
            return [...canvasElts, 
            {text: "", x: x, y: y, width: 0, height: 0, 
            font: font, fontSize: fontSize, fontWeight: fontWeight, fontStyle: fontStyle, selected: true}]
        });
    }

    const setBoxDimension = (newText: string, elt: CanvasElement) => {
        const sentence = newText.split('\n');
        let boxWidth = -1;
        sentence.forEach((line, idx) => {
            if (ctx) {
                ctx && ctx.fillText(line, elt.x, elt.y + elt.fontSize*idx);
                if (ctx.measureText(line).width >= boxWidth) {
                    boxWidth = ctx.measureText(line).width;
                }
            }
        });
        const boxHeight = elt.fontSize * (sentence.length + 1);
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
            canvasElts[canvasElts.length-1].text = newText;
            return [...canvasElts];
        });
    }

    const returnText = (elt: CanvasElement, idx: number) => {
        const arr = elt.text.split('\n');
        console.log(arr);
        const children: JSX.Element[] = [];
        arr.forEach((child) => {
            switch (child) {
                case '&nbsp;': 
                    children.push(<>&nbsp;</>);
                    break;
                case '<br>': 
                    children.push(<br/>);
                    break;
                default:
                    if (child.includes('<strong>')) {
                        children.push(<strong>{child.substring(8, child.length)}</strong>)
                    } else {
                        children.push(<>{child}</>);
                    }
                    break;
            }
        })
        let border = "border-0";
        if (elt.selected) {
            children.push(<span className="animate-blinker inline-block">_</span>);
            border = "border-2";
        }
        return <p key={idx} className={`absolute ${border}`} style={{fontFamily: `${elt.font}`, fontSize: `${elt.fontSize}px`, 
        fontStyle: `${elt.fontStyle}`, fontWeight: `${elt.fontWeight}`, top: `${elt.y}px`, left: `${elt.x}px`}}
        >{children}</p>
    }

    return (
        <>
        <div className="flex place-content-center w-screen">
            <canvas className="bg-amber-50 h-[500px] mobile:w-screen mobile:border-0 laptop:border-4 laptop:w-240" ref={canvasRef} tabIndex={0} 
            onClick={(e) => {selectPos(e.clientX, e.clientY)}} onKeyDown={(e) => {e.preventDefault(); enterText(e.key)}}>
            </canvas>
            {canvasElts.map((elt, idx) => returnText(elt, idx))}
        </div>
        </>
    );
}