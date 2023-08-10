import NoteBooks from "./NoteBooks";
import Pages from "./Pages";

export default function Notes() {
    return (
        <>
        <div className="border-r-2 bg-gray-50 resize-x flex">
            <NoteBooks/>
            <Pages/>
        </div>
        </>
    )
}