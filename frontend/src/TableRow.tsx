import { TableRowProps } from "./Props.ts";
import DOMPurify from "isomorphic-dompurify";

export default function TableRow({ rowId, elt, rowContent, selectTableText, updateText }: TableRowProps) {
    // <p onClick={_ => selectTableText(elt, rowId, colId)}></p>
    return (
        <tr>
            {rowContent.map((content, colId) => {
                return (
                    <td className="border border-gray-800 min-w-[75px]" key={colId} onMouseDown={e => e.stopPropagation()}>
                        <div 
                        contentEditable='true' 
                        onMouseMove={e => e.stopPropagation()}
                        // onKeyUp={e => updateText(e.currentTarget.innerHTML)}
                        >  
                        </div>
                    </td>
                )
            }
                
            )}
        </tr>
    )
}