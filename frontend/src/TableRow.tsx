import { TableRowProps } from "./Props.ts";

export default function TableRow({ rowContent }: TableRowProps) {
    return (
        <tr>
            {rowContent.map((content, colId) => 
                (<td  className="border border-gray-800" key={colId}>{content}</td>)
            )}
        </tr>
    )
}