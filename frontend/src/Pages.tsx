import { useEffect, useState } from "react";
import Page from "./Page";
import { useSelector } from "react-redux";
import { rootState } from "./store";

const notahApi = "http://localhost:5245/api/v1/Pages/"

type Page = {
    id: string;
    title: string;
}

export default function Pages() {
    const noteBook = useSelector((state: rootState) => state.noteBook);
    const page = useSelector((state: rootState) => state.page);
    const [pages, setPages] = useState<Page[]>([]);
    
    useEffect(() => {
        if (noteBook.id === "quick-note") {
            setPages([{id: "page-1", title: "Page 1"}, {id: "page-2", title: "Page 2"}]);
        }
        fetch(notahApi + "byNoteBookId/" + noteBook.id)
        .then(res => res.json())
        .then(data => data as Page[])
        .then(data => {
            console.log(data);
            const pgs = new Array<Page>();
            data.forEach(p => pgs.push({id: p.id, title: p.title}));
            setPages(pgs);
        });
    }, [])

    return (
        <>
        <div className="h-full flex-1">
            <button className="hover:bg-gray-200 active:bg-gray-300 whitespace-nowrap border-b-2 p-1 w-full font-bold text-amber-500">
                + Add Page
            </button>
            <div className="">
                <ul>
                    {pages.map(p => <Page id={p.id} title={p.title}/>)}
                </ul>
            </div>
        </div>
        </>
        
    )
}