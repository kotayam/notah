import { TableProps } from "./Props.ts";
import TableRow from "./TableRow.tsx";
import DOMPurify from "isomorphic-dompurify";
import HTMLReactParser from "html-react-parser";

// const window = new JSDOM('').window;
// const DOMPurify = createDOMPurify(window as unknown as Window);

export default function Table({ elt, x, y, selectTableText, selectedElt, updateText }: TableProps) {
    //<p onClick={_ => selectTableText(elt, -1, headId)}></p>
    //<textarea id={`h${headId}`} className="border-none outline-none bg-inherit overflow-visible w-full h-full" placeholder={`Header ${headId + 1}`} rows={1}></textarea>

    return (
        <>
        <table className="absolute border-gray-800 table-collapse table-auto text-left" style={{top: y, left: x}}>
            <thead>
                <tr>
                    {elt.headers.map((head, headId) => {
                        let clean = DOMPurify.sanitize(head);
                        return (<th className="border border-gray-800 min-w-[30px]" key={headId}><div contentEditable onKeyUp={e => updateText(e.currentTarget.innerHTML)}></div></th>)
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