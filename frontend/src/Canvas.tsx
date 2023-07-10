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
    text: JSX.Element;
    x: number;
    y: number;
    width: number;
    height: number;
    font: string;
    fontSize: number;
    fontWeight: string;
    fontStyle: string;
}

export default function Canvas({ mode, fontSize, font, bold, italic }: CanvasProps) {
    const [pos, setPos] = useState({x: -1, y: -1});
    const [text, setText] = useState("");
    const [canvasElts, setCanvasElts] = useState<CanvasElement[]>([]);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    let canvas: HTMLCanvasElement;
    let rect: DOMRect;
    let ctx: CanvasRenderingContext2D | null;
    // let scale: number;

    useEffect(() => {
        if (canvasRef.current) {
            canvas = canvasRef.current;
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
        setCanvasElts(canvasElts => [
            ...canvasElts, 
            {text: <></>, x: x, y: y, width: 0, height: 0, 
            font: font, fontSize: fontSize, fontWeight: fontWeight, fontStyle: fontStyle}
        ]);
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

    const enterText = (key: string, ctx: CanvasRenderingContext2D) => {
        console.log(`key pressed: ${key}`);
        const k = key.toLowerCase();
        let newText = "";
        switch (k) {
            case 'backspace': 
                newText = text.substring(0, text.length-1);
                setText(newText);
                setCanvasElts(canvasElts => {
                    canvasElts[canvasElts.length-1].text = <>{newText}</>;
                    return [...canvasElts];
                });
                return;
            case ' ':
                newText = text + " ";
                setText(newText);
                setCanvasElts(canvasElts => {
                    canvasElts[canvasElts.length-1].text = <>{canvasElts[canvasElts.length-1].text}&nbsp;</>;
                    return [...canvasElts];
                });
                return;
            case 'enter':
                newText = text + '\n';
                setText(newText);
                setCanvasElts(canvasElts => {
                    canvasElts[canvasElts.length-1].text = <>{canvasElts[canvasElts.length-1].text}<br/></>;
                    return [...canvasElts];
                });
                return;
        }
        if (k.length !== 1) {
            return;
        }
        newText = text + key;
        setText(newText);
        setCanvasElts(canvasElts => {
            canvasElts[canvasElts.length-1].text = <>{newText}</>;
            return [...canvasElts];
        });
        return;
    }

    const returnText = (elt: CanvasElement) => {
        return <p className="absolute border-2" style={{fontFamily: `${elt.font}`, fontSize: `${elt.fontSize}px`, 
        fontStyle: `${elt.fontStyle}`, fontWeight: `${elt.fontWeight}`, top: `${elt.y}px`, left: `${elt.x}px`}}
        >{elt.text}</p>
    }

    return (
        <>
        <div className="flex place-content-center w-screen">
            <canvas className="bg-amber-50 h-[500px] mobile:w-screen mobile:border-0 laptop:border-4 laptop:w-240" ref={canvasRef} tabIndex={0} 
            onClick={(e) => {selectPos(e.clientX, e.clientY)}} onKeyDown={(e) => {if (ctx) enterText(e.key, ctx)}}>
            </canvas>
            {canvasElts.map(elt => returnText(elt))}
        </div>
        </>
    );
}