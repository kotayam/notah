import "./App.css";
import { useRef, useEffect, useState } from "react";

interface CanvasProps {
    mode: string;
}

export default function Canvas({ mode }: CanvasProps) {
    const [pos, setPos] = useState({x: -1, y: -1});
    const [text, setText] = useState("");
    const [fontSize, setFontSize] = useState(20);
    const [font, setFont] = useState("sans-serif");

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
                ctx.font = `${fontSize}px ${font}`;
                ctx.fillText(text, pos.x, pos.y);
                ctx.strokeRect(pos.x, pos.y - fontSize*1.5, ctx.measureText(text).width, fontSize * 2);
                console.log(ctx.measureText(text));
            }
        }
    });

    const selectPos = (x: number, y: number) => {
        setText("");
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const coordX = (x - rect.left) * scaleX;
        const coordY = (y - rect.top) * scaleY;
        setPos({x: coordX, y: coordY});
    }

    const enterText = (key: string) => {
        console.log(`key pressed: ${key}`);
        if (key === 'Backspace') {
            setText(text.substring(0, text.length-1));
            return;
        }
        setText(text + key);
    }

    return (
        <>
        <div className="flex place-content-center">
            <canvas className="bg-amber-50 border-4 mobile:w-screen mobile:border-0 w-240 h-screen" ref={canvasRef} tabIndex={0} onClick={(e) => {selectPos(e.clientX, e.clientY)}} onKeyDown={(e) => {enterText(e.key)}}>
            </canvas>
        </div>
        </>
    );
}