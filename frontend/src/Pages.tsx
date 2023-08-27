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
    const [fetchSwitch, setFetchSwitch] = useState(false);
    
    useEffect(() => {
        // if (noteBook.id === "quick-note") {
        //     setPages([{id: "page-1", title: "Page 1"}, {id: "page-2", title: "Page 2"}]);
        // }
        fetch(notahApi + "byNoteBookId/" + noteBook.id)
        .then(res => res.json())
        .then(data => data as Page[])
        .then(data => {
            console.log(data);
            const pgs = new Array<Page>();
            data.forEach(p => pgs.push({id: p.id, title: p.title}));
            setPages(pgs);
        })
        .catch(e => {
            console.error(e);
        })
    }, [fetchSwitch, noteBook])

    const addPage = () => {
        fetch(notahApi + noteBook.id, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({title: `Page ${pages.length + 1}`})
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            setFetchSwitch(prevState => !prevState);
        })
        .catch(e => {
            console.log("Failed to add page");
        })
    }

    const deletePage = (id: string) => {
        fetch(notahApi + id, {
          method: "DELETE",
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            setFetchSwitch((prevState) => !prevState);
          })
          .catch((e) => {
            console.error(e);
          });
      };

    return (
        <>
        <div className="h-full flex-1">
            <button className="hover:bg-gray-200 active:bg-gray-300 whitespace-nowrap border-b-2 p-1 w-full font-bold text-amber-500" onClick={() => addPage()}>
                + Add Page
            </button>
            <div>
                <ul>
                    {pages.map(p => <Page key={p.id} id={p.id} title={p.title} deletePage={deletePage}/>)}
                </ul>
            </div>
        </div>
        </>
        
    )
}