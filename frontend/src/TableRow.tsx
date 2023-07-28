import { TableRowProps } from "./Props.ts";

export default function TableRow({ rowContent, rowId }: TableRowProps) {
    return (
        <tr>
            {rowContent.map((_, colId) => {
                return (
                    <td className="border border-gray-800 min-w-[75px]" key={`${rowId}-${colId}`} onMouseDown={e => e.stopPropagation()}>
                        <div 
                        contentEditable='true' 
                        onMouseMove={e => e.stopPropagation()}
                        >  
                        </div>
                    </td>
                )
            }
                
            )}
        </tr>
    )
}