import { ShapeProps } from "./Props.ts";
import { useState } from "react";

export default function Shape({elt}: ShapeProps) {
    const [isEditable, setIsEditable] = useState(false);

    let dim = {x: elt.x, y: elt.y, width: Math.abs(elt.width), height: Math.abs(elt.height)};
    let line: any = {x1: 0, y1: 0, x2: '100%', y2: '100%'};

    if (elt.width < 0 && elt.height < 0) {
        dim.x += elt.width;
        dim.y += elt.height;
        line.x1 = '100%';
        line.y1 = '100%';
        line.x2 = 0;
        line.y2 = 0;
    }
    else if (elt.width < 0 && elt.height >= 0) {
        dim.x += elt.width;
        line.x1 = '100%';
        line.x2 = 0;
    }
    else if (elt.width >= 0 && elt.height < 0) {
        dim.y += elt.height;
        line.y1 = '100%';
        line.y2 = 0;
    }

    switch (elt.shape) {
        case 'rect':
            return (
                <div 
                contentEditable={isEditable} 
                className="absolute bg-gray-100 border-2 border-black text-center" 
                style={{top: dim.y, left: dim.x, width: dim.width, height: dim.height}}
                onMouseDown={e => e.stopPropagation()} 
                onMouseEnter={e => {e.stopPropagation(); setIsEditable(true)}} 
                onMouseLeave={e => {e.stopPropagation(); setIsEditable(false)}}
                >
                </div>
            )
        case 'circle':
            return (
                <div 
                contentEditable={isEditable} 
                className="absolute bg-gray-100 border-black border-2 text-center" 
                style={{top: dim.y, left: dim.x, width: dim.width, height: dim.height, borderRadius: '50%'}}
                onMouseDown={e => e.stopPropagation()}
                onMouseEnter={e => {e.stopPropagation(); setIsEditable(true)}} 
                onMouseLeave={e => {e.stopPropagation(); setIsEditable(false)}}
                >
                </div>
            )
        case 'line':
            return (
                <svg 
                className="absolute stroke-black" 
                style={{top: dim.y, left: dim.x}} 
                width={dim.width} 
                height={dim.height}
                >
                    <line x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}/>
                </svg>
            )
    }
}