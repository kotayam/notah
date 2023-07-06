import "./App.css";
import { useRef, useEffect, useState } from "react";

interface CanvasProps {
    mode: string;
}

export default function Canvas({ mode }: CanvasProps) {
    const [coordinate, setCoordinate] = useState({x: -1, y: -1});
    const [text, setText] = useState("");

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
        }
    })

    const select = (x: number, y: number) => {
        setCoordinate({x: x, y: y});
        setText("");
    }

    const write = (key: string) => {
        console.log(`coordinate: (${coordinate.x}, ${coordinate.y})`);
        console.log(`key pressed: ${key}`);
        if (ctx) {
            setText(text + key);
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            const coordX = (coordinate.x - rect.left) * scaleX;
            const coordY = (coordinate.y - rect.top) * scaleY;
            console.log(`x: ${coordX}, y: ${coordY}`);
            ctx.font = "20px sans-serif";
            ctx.fillText(text, coordX, coordY);
        }
    }

    return (
        <>
        <div className="flex place-content-center">
            <canvas className="bg-amber-50 border-4 mobile:w-screen mobile:border-0 h-screen" ref={canvasRef} tabIndex={0} onClick={(e) => {select(e.clientX, e.clientY)}} onKeyDown={(e) => {write(e.key)}}>
            </canvas>
        </div>
        </>
    );
}