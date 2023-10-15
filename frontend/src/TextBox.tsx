import { TextBoxProps } from "./Props";
import { useState } from "react";

export default function TextBox({
  elt,
  selectTextBox,
  selectedElt,
}: TextBoxProps) {
  const [hover, setHover] = useState(false);
  let border;
  selectedElt.id === elt.id ? (border = "border-2") : (border = "border-0");

  const handleHover = () => {
    if (!hover) return;
    return (
      <div className="bg-gray-100 border-b-2">
        <button>move</button>
        <button>delete</button>
      </div>
    );
  };

  return (
    <>
      <div
        className="absolute hover:border-2"
        style={{ top: elt.y, left: elt.x }}
        onClick={(_) => {
          selectTextBox(elt);
        }}
        onMouseDown={(e) => e.stopPropagation()}
        onMouseEnter={(e) => {
          setHover(true);
        }}
        onMouseLeave={(_) => setHover(false)}
      >
        {handleHover()}
        <div
          contentEditable="true"
          key={elt.id}
          className={`min-w-[100px] ${border}`}
          style={{
            fontFamily: elt.font,
            fontSize: elt.fontSize,
            color: elt.fontColor,
          }}
        ></div>
      </div>
    </>
  );
}
