import { TableProps } from "./Props.ts";
import TableRow from "./TableRow.tsx";

export default function Table({ elt, x, y }: TableProps) {
    return (
        <>
        <table className="absolute border-gray-800 border-collapse table-auto" style={{top: y, left: x}}>
            <thead>
                <tr>
                    {elt.headers.map((head, headID) =>
                        <th className="border border-gray-800" onClick={e => console.log(e)} key={headID}>{head}</th>
                    )}
                </tr>
            </thead>
            <tbody>
                {elt.content.map((rowContent, rowID) =>
                    <TableRow key={rowID} rowContent={rowContent}/>
                )}
            </tbody>
        </table>
        </>
    )
} 