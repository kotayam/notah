import { TextBoxProps } from "./Props";
import DOMPurify from "isomorphic-dompurify";
import HTMLReactParser from "html-react-parser";

export default function TextBox({ elt, selectTextBox, x, y, selectedElt, updateText }: TextBoxProps) {

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
            <div contentEditable onKeyUp={e => {updateText(e.currentTarget.innerHTML)}} key={elt.id} className={`absolute hover:border-2 min-w-[100px] ${border}`} style={{ top: `${y}px`, left: `${x}px` }} onClick={_ => {selectTextBox(elt)}}
            >
            </div>
        </>
        )
}