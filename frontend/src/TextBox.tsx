import { TextBoxProps } from "./Props";
import { useState } from "react";

export default function TextBox({ elt, selectTextBox, selectedElt, updateText }: TextBoxProps) {
    const [isEditable, setIsEditable] = useState(false);
    // const returnText = () => {
    //     const arr = elt.text.split('\n');
    //     if (arr[0] === '') arr.shift();
    //     const children = [];
    //     arr.map((child, idx) => {
    //         switch (child) {
    //             case '&nbsp;': 
    //                 children.push(<span key={idx}>&nbsp;</span>);
    //                 break;
    //             case '<br>': 
    //                 children.push(<br key={idx} />);
    //                 break;
    //             default:
    //                 if (child.includes('<strong>')) {
    //                     children.push(<strong key={idx}>{child.substring(8, child.length)}</strong>)
    //                 } else {
    //                     children.push(<span key={idx}>{child}</span>);
    //                 }
    //                 break;
    //         }
    //     })
    //     let border = "border-0";
    //     if (selectedElt.id === elt.id) {
    //         children.push(<span key='blinker' className="animate-blinker inline-block">_</span>);
    //         border = "border-2";
    //     }

    let border;
    selectedElt.id === elt.id ? border = "border-2" : border = "border-0";
    //fontFamily: `${elt.font}`, fontSize: `${elt.fontSize}px`, fontStyle: `${elt.fontStyle}`, fontWeight: `${elt.fontWeight}`,
    // {HTMLReactParser(DOMPurify.sanitize(elt.text))}

    return (
        <>
            <div 
            contentEditable='true'
            key={elt.id} 
            className={`absolute hover:border-2 min-w-[100px] ${border}`} 
            style={{ top: elt.y, left: elt.x }} 
            onClick={_ => {selectTextBox(elt)}}
            // onKeyUp={e => {updateText(e.currentTarget.innerHTML)}} 
            onMouseDown={e => e.stopPropagation()}
            >
            </div>
        </>
        )
}