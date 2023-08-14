import { useEffect, useState } from "react";
import NoteBook from "./NoteBook";
import { useSelector } from "react-redux";
import { rootState } from "./store";

const notahApi = "http://localhost:5245/api/v1/NoteBooks/"

type NoteBook = {
    id: string;
    title: string;
}

export default function NoteBooks() {
    const [noteBooks, setNoteBooks] = useState<NoteBook[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [fetchSwitch, setFetchSwitch] = useState(false);
    const account = useSelector((state: rootState) => state.account);

    useEffect(() => {
        // if (!itemAdded && noteBooks.length) {
        //     return;
        // }
        fetch(notahApi + "byOwnerId/" + account.id)
        .then(res => res.json())
        .then(data => data as NoteBook[])
        .then(data => {
            console.log(data);
            const nbs = new Array<NoteBook>();
            data.forEach(nb => nbs.push({id: nb.id, title: nb.title}));
            setNoteBooks(nbs);
        })
        .catch(e => {
            console.error(e);
        });
    }, [fetchSwitch])

    const addNoteBook = () => {
        fetch(notahApi + account.id, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({title: `Notebook ${noteBooks.length}`})
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            setFetchSwitch(prevState => !prevState);
        })
        .catch(e => {
            console.log("Failed to add notebook");
        })
    }
    
    const returnEditedNoteBook = () => {
        if (isEditing) {
            return (
                <li className="w-full"><input type="text" placeholder="New Notebook"/></li>
            )
        }
    }

    return (
        <>
        <div className="h-full flex-1 border-r-2">
            <button className="hover:bg-gray-200 active:bg-gray-300 whitespace-nowrap p-1 border-b-2 w-full font-bold text-amber-500" onClick={() => addNoteBook()}>
                + Add Notebook
            </button>
            <div className="">
                <ul>
                    {noteBooks.map(nb => <NoteBook key={nb.id} id={nb.id} title={nb.title}/>)}
                </ul>
            </div>
        </div>
        </>
    )
}