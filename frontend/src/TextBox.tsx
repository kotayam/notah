import { TextBoxProps } from "./Props";

export default function TextBox({ elt, selectTextBox, x, y }: TextBoxProps) {

    const returnText = () => {
        const arr = elt.text.split('\n');
        if (arr[0] === '') arr.shift();
        const children = [];
        arr.map((child, idx) => {
            switch (child) {
                case '&nbsp;': 
                    children.push(<span key={idx}>&nbsp;</span>);
                    break;
                case '<br>': 
                    children.push(<br key={idx} />);
                    break;
                default:
                    if (child.includes('<strong>')) {
                        children.push(<strong key={idx}>{child.substring(8, child.length)}</strong>)
                    } else {
                        children.push(<span key={idx}>{child}</span>);
                    }
                    break;
            }
        })
        let border = "border-0";
        if (elt.selected) {
            children.push(<span key='blinker' className="animate-blinker inline-block">_</span>);
            border = "border-2";
        }
        return (
            <p 
            id={elt.id.toString()} 
            className={`absolute hover:border-2 ${border}`} 
            style={{
                fontFamily: `${elt.font}`, fontSize: `${elt.fontSize}px`, 
                fontStyle: `${elt.fontStyle}`, fontWeight: `${elt.fontWeight}`, 
                top: `${y}px`, left: `${x}px`
            }} 
            onMouseDown={e => {console.log(e); selectTextBox(elt)}}
            >
            {children}
            </p>
        )
    }

    //onClick={e => {console.log(e); selectText(e.currentTarget)}}

    return (
        <>
        {returnText()}
        </>
    )
}