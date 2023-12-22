import { useEffect, useState } from "react";
import Page from "./Page";
import { useSelector, useDispatch } from "react-redux";
import { rootState, actionCreators } from "./store";
import { bindActionCreators } from "@reduxjs/toolkit";
import API from "./API.json";

const apiLink = API["isDev"]? API["API"]["dev"] : API["API"]["production"];

type Page = {
  id: string;
  title: string;
  dateCreated: string;
  lastSaved: string;
};

export default function Pages() {
  const noteBook = useSelector((state: rootState) => state.noteBook);
  const page = useSelector((state: rootState) => state.page);
  const isSaved = useSelector((state: rootState) => state.isSaved);
  const dispatch = useDispatch();
  const { setPage } = bindActionCreators(actionCreators, dispatch);
  const [pages, setPages] = useState<Page[]>([]);
  const [fetchSwitch, setFetchSwitch] = useState(false);

  useEffect(() => {
    if (noteBook.id === "-1") {
      return;
    }
    fetch(apiLink + `Pages/byNoteBookId/${noteBook.id}`, {
      credentials: 'include'
    })
      .then((res) => res.json())
      .then((data) => data as Page[])
      .then((data) => {
        console.log(data);
        const pgs = new Array<Page>();
        data.forEach((p) => pgs.push({ id: p.id, title: p.title, dateCreated: p.dateCreated, lastSaved: p.lastSaved }));
        setPages(pgs);
        if (pgs.length > 0 && page.id === "-1") {
          setPage({id: pgs[0].id, title: pgs[0].title, dateCreated: pgs[0].dateCreated, lastSaved: pgs[0].lastSaved});
        }
      })
      .catch((e) => {
        setPage({id: "-1", title: "Error", dateCreated: "", lastSaved: "Error"});
        console.error(e);
        
      });
  }, [fetchSwitch, noteBook, page.title]);

  const addPage = () => {
    if (!isSaved) {
      alert("save before adding a new page!");
      return;
    }
    fetch(apiLink + `Pages/${noteBook.id}`, {
      method: "POST",
      credentials: 'include',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: `Page ${pages.length}` }),
    })
      .then((res) => res.json())
      .then(data => {
        if (data.status === 404) {
          alert("Select a notebook to add a new page!");
          return;
        }
        else return data as Page;
      })
      .then((data) => {
        console.log(data);
        if (data) setPage({id: data.id, title: data.title, dateCreated: data.dateCreated, lastSaved: data.lastSaved});
        setFetchSwitch((prevState) => !prevState);
      })
      .catch((_) => {
        console.log("Failed to add page");
        
      });
  };

  const deletePage = (id: string) => {
    fetch(apiLink + `Pages/${id}`, {
      method: "DELETE",
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setFetchSwitch((prevState) => !prevState);
        setPage({id: pages[0].id, title: pages[0].title, dateCreated: pages[0].dateCreated, lastSaved: pages[0].lastSaved});
      })
      .catch((e) => {
        console.error(e);
      });
  };

  return (
    <>
      <div className="h-full flex-1 overflow-auto">
        <button
          className="hover:bg-gray-200 active:bg-gray-300 whitespace-nowrap mobile:whitespace-normal w-full overflow-hidden border-b-2 p-1 font-bold text-amber-500"
          onClick={() => addPage()}
        >
          + Add Page
        </button>
        <div>
          <ul>
            {pages.map((p) => (
              <Page
                key={p.id}
                id={p.id}
                title={p.title}
                dateCreated={p.dateCreated}
                lastSaved={p.lastSaved}
                deletePage={deletePage}
              />
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
