import { TableRowProps } from "./Props.ts";
import DOMPurify from "isomorphic-dompurify";
import HTMLReactParser from "html-react-parser";

export default function TableRow({ rowId, elt, rowContent, selectTableText, updateText }: TableRowProps) {
    // <p onClick={_ => selectTableText(elt, rowId, colId)}></p>
    return (
        <tr>
            {rowContent.map((content, colId) => {
                const clean = DOMPurify.sanitize(content);
                return (<td className="border border-gray-800 min-w-[30px]" key={colId}><div contentEditable onKeyUp={e => updateText(e.currentTarget.innerHTML)}></div></td>)
            }
                
            )}
        </tr>
    )
}