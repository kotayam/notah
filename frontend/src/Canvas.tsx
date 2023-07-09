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
    let scale: number;

    useEffect(() => {
        if (canvasRef.current) {
            canvas = canvasRef.current;
            rect = canvas.getBoundingClientRect();
            ctx = canvas.getContext('2d');
            scale = window.devicePixelRatio;
            canvas.width = rect.width * scale;
            canvas.height = rect.height * scale;
            if (ctx && pos.x > -1 && pos.y > -1) {
                draw(ctx);
            }
        }
    });

    const draw = (ctx: CanvasRenderingContext2D) => {
        console.log(canvasElts);
        canvasElts.forEach((elt, idx) => {
            ctx.font = `${elt.fontWeight} ${elt.fontStyle} ${elt.fontSize}px ${elt.font}`;
            const sentence = elt.text.split('\n');
            let boxWidth = -1;
            sentence.forEach((line, idx) => {
                if (ctx) {
                    ctx && ctx.fillText(line, elt.x, elt.y + elt.fontSize*idx);
                    if (ctx.measureText(line).width >= boxWidth) {
                        boxWidth = ctx.measureText(line).width;
                    }
                }
            });
            if (idx === canvasElts.length-1) {
                ctx.strokeRect(elt.x, elt.y - elt.fontSize*1.5, boxWidth, elt.fontSize * (sentence.length + 1));
            }
            
        });
    }

    const selectPos = (x: number, y: number) => {
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
            {text: '', x: coordX, y: coordY, font: font, fontSize: fontSize, fontWeight: fontWeight, fontStyle: fontStyle}
        ]);
    }

    const enterText = (key: string) => {
        console.log(`key pressed: ${key}`);
        const k = key.toLowerCase();
        switch (k) {
            case 'backspace': 
                setText(text.substring(0, text.length-1));
                setCanvasElts(canvasElts => {
                    canvasElts[canvasElts.length-1].text = text.substring(0, text.length-1);
                    return [...canvasElts];
                });
                return;
            case ' ':
                setText(text + " ");
                setCanvasElts(canvasElts => {
                    canvasElts[canvasElts.length-1].text = text + " ";
                    return [...canvasElts];
                });
                return;
            case 'enter':
                setText(text + "\n");
                setCanvasElts(canvasElts => {
                    canvasElts[canvasElts.length-1].text = text + "\n";
                    return [...canvasElts];
                });
                return;
        }
        if (k.length !== 1) {
            return;
        }
        setText(text + key);
        setCanvasElts(canvasElts => {
            canvasElts[canvasElts.length-1].text = text + key;
            return [...canvasElts];
        });
        return;
    }

    return (
        <>
        <div className="flex place-content-center w-screen">
            <canvas className="bg-amber-50 h-[500px] mobile:w-screen mobile:border-0 laptop:border-4 laptop:w-240" ref={canvasRef} tabIndex={0} 
            onClick={(e) => {selectPos(e.clientX, e.clientY)}} onKeyDown={(e) => {enterText(e.key)}}>
            </canvas>
        </div>
        </>
    );
}