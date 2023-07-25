import { TableProps } from "./Props.ts";
import TableRow from "./TableRow.tsx";

export default function Table({ elt, selectTableText, updateText }: TableProps) {

    return (
        <>
        <table className="absolute border-gray-800 table-collapse table-auto text-left" style={{top: elt.y, left: elt.x}}>
            <tbody>
                {elt.tableContent.map((rowContent, rowId) =>
                    <TableRow key={rowId} rowId={rowId} rowContent={rowContent} elt={elt} selectTableText={selectTableText} updateText={updateText}/>
                )}
            </tbody>
        </table>
        </>
    )
} 