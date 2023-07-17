import { TableProps } from "./Props.ts";

export default function Table({ elt, x, y }: TableProps) {
    return (
        <>
        <table className="absolute border border-collapse table-auto" style={{top: y, left: x}}>
            <thead>
                <tr>
                    {elt.content[0].map((head, headID) =>
                        <th key={headID}>{head}</th>)}
                </tr>
            </thead>
            <tbody>
                <tr>
                    {elt.content[1].map((row, rowID) =>
                        (<td  key={rowID}>{row}</td>))}
                </tr>
            </tbody>
        </table>
        </>
    )
} 