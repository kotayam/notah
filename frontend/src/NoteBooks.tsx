import { useEffect, useState } from "react";
import NoteBook from "./NoteBook";

const accountId = "cc64a369-5d7c-4db6-a19f-f849db5d782c";
const notahApi = "http://localhost:5245/api/v1/NoteBooks/"

type NoteBook = {
    id: string;
    title: string;
}

export default function NoteBooks() {
    const [noteBooks, setNoteBooks] = useState<NoteBook[]>([]);

    useEffect(() => {
        fetch(notahApi + "byOwnerId/" + accountId)
        .then(res => res.json())
        .then(data => data as NoteBook[])
        .then(data => {
            console.log(data);
            const nbs = new Array<NoteBook>();
            data.forEach(nb => nbs.push({id: nb.id, title: nb.title}));
            setNoteBooks(nbs);
        });
    }, noteBooks)

    const addNoteBook = () => {
        fetch(notahApi + accountId + "?title=Notebook1", {
            method: "POST",
            
        })
        .then(res => res.json())
        .then(data => console.log(data));
    }

    return (
        <>
        <div className="h-full flex-1 border-r-2">
            <button className="hover:bg-gray-200 active:bg-gray-300 whitespace-nowrap p-1 border-b-2 w-full font-bold text-amber-500" onClick={() => addNoteBook()}>
                + Add Notebook
            </button>
            <div className="">
                <ul>
                    <NoteBook id={"quick-note"} title={"Quick Note"}/>
                    <NoteBook id={"test"} title={"test"}/>
                    {noteBooks.map(nb => <NoteBook id={nb.id} title={nb.title}/>)}
                </ul>
            </div>
        </div>
        </>
    )
}