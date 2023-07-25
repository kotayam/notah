import { TextBoxProps } from "./Props";

export default function TextBox({ elt, selectTextBox, selectedElt}: TextBoxProps) {
    let border;
    selectedElt.id === elt.id ? border = "border-2" : border = "border-0";

    return (
        <>
            <div 
            contentEditable='true'
            key={elt.id} 
            className={`absolute hover:border-2 min-w-[100px] ${border}`} 
            style={{ top: elt.y, left: elt.x, fontFamily: elt.font, fontSize: elt.fontSize}} 
            onClick={_ => {selectTextBox(elt)}}
            onMouseDown={e => e.stopPropagation()}
            >
            </div>
        </>
        )
}