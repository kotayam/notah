import CanvasMemo from "./CanvasMemo";
import NotesMemo from "./NotesMemo";
import ToolbarMemo from "./ToolbarMemo";

export default function NotahMemo() {
  return (
    <div className="bg-amber-50 mobile:text-sm">
      <ToolbarMemo/>
      <div className="flex justify-start h-full">
        <NotesMemo/>
        <CanvasMemo />
      </div>
    </div>
  );
}
