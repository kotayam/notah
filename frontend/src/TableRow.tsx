import { TableRowProps } from "./Props.ts";

export default function TableRow({ elt, rowId }: TableRowProps) {
    const returnTableCol = () => {
        const regex = new RegExp('.*<div contenteditable="true">(.*)</div>.*');
        const ins = elt.innerHtml.match(regex);
        console.log(ins);
        let tbCol: JSX.Element[] = [];
        for (let c = 0; c < elt.col; c++) {
            tbCol.push(<td className="border border-gray-800 min-w-[75px]" key={`${rowId}-${c}`} onMouseDown={e => e.stopPropagation()}>
            <div 
            contentEditable='true' 
            onMouseMove={e => e.stopPropagation()}
            >  
            </div>
        </td>);
        }
        return tbCol;
    }
    return (
        <tr>
            {returnTableCol()}
        </tr>
    )
}