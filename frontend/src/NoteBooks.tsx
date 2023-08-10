import { useEffect, useState } from "react";

const accountId = "d6310fda-f95b-4200-a33b-c83543c1fcfd";
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
        .then(noteBookDtos => {
            console.log(noteBookDtos);
            const nbs = new Array<NoteBook>();
            noteBookDtos.forEach(nb => nbs.push({id: nb.id, title: nb.title}));
            setNoteBooks(nbs);
        });
    }, [])

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
                    <li className="hover:bg-gray-200 p-1">Quick Note</li>
                    {noteBooks.map(nb => <li key={nb.id} className="hover:bg-gray-200 p-1">{nb.title}</li>)}
                </ul>
            </div>
        </div>
        </>
    )
}