import { TableRowProps } from "./Props.ts";
import DOMPurify from "isomorphic-dompurify";

export default function TableRow({ elt, rowId, selectTableText }: TableRowProps) {
    const returnTableCol = () => {
        const splitter = new RegExp('<td');
        const splitted = elt.innerHtml.split(splitter);
        const matcher = new RegExp('<div contenteditable="true" class="outline-none">(.*)</div>');
        splitted.forEach((reg, i) => {
            const content = reg.match(matcher);
            if (content) splitted[i] = content[1];
        })
        let tbCol: JSX.Element[] = [];
        for (let c = 0; c < elt.col; c++) {
            tbCol.push(<td className="border border-gray-800 min-w-[75px]" key={`${rowId}-${c}`} id={`${rowId}-${c}`} onMouseDown={e => e.stopPropagation()}>
            <div 
            contentEditable='true' 
            className="outline-none"
            onMouseDown={_ => selectTableText(elt, rowId, c)}
            onMouseMove={e => e.stopPropagation()}
            dangerouslySetInnerHTML={{__html : DOMPurify.sanitize(splitted[c + elt.col * rowId +1])}}
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