import { TableProps } from "./Props.ts";
import TableRow from "./TableRow.tsx";
import { useState } from "react";

// const window = new JSDOM('').window;
// const DOMPurify = createDOMPurify(window as unknown as Window);

export default function Table({ elt, selectTableText, selectedElt, updateText }: TableProps) {
    const [isEditable, setIsEditable] = useState(false);
    //<p onClick={_ => selectTableText(elt, -1, headId)}></p>
    //<textarea id={`h${headId}`} className="border-none outline-none bg-inherit overflow-visible w-full h-full" placeholder={`Header ${headId + 1}`} rows={1}></textarea>

    return (
        <>
        <table className="absolute border-gray-800 table-collapse table-auto text-left" style={{top: elt.y, left: elt.x}}>
            <thead>
                <tr>
                    {elt.headers.map((head, headId) => {
                        return (
                            <th className="border border-gray-800 min-w-[75px]" key={headId} onMouseDown={e => e.stopPropagation()}>
                                <div 
                                contentEditable='true' 
                                onMouseMove={e => e.stopPropagation()}
                                // onKeyUp={e => updateText(e.currentTarget.innerHTML)}
                                >
                                </div>
                            </th>
                        )
                    })}
                </tr>
            </thead>
            <tbody>
                {elt.content.map((rowContent, rowId) =>
                    <TableRow key={rowId} rowId={rowId} rowContent={rowContent} elt={elt} selectTableText={selectTableText} updateText={updateText}/>
                )}
            </tbody>
        </table>
        </>
    )
} 