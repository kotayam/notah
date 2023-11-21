import { NotesProps } from "./Props";
import NoteBooks from "./NoteBooks";
import Pages from "./Pages";

export default function Notes({access} : NotesProps) {
  return (
    <>
      <div className="border-r-2 max-w-[25%] bg-gray-50 resize-x flex">
        <NoteBooks />
        <Pages />
      </div>
    </>
  );
}
