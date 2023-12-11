import { useEffect, useState } from "react";
import Page from "./Page";
import { useSelector, useDispatch } from "react-redux";
import { rootState, actionCreators } from "./store";
import { bindActionCreators } from "@reduxjs/toolkit";

const notahApi = "http://localhost:5245/api/v1/Pages/";

type Page = {
  id: string;
  title: string;
  dateCreated: string;
  lastEdited: string;
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
    fetch(notahApi + "byNoteBookId/" + noteBook.id, {
      credentials: 'include'
    })
      .then((res) => res.json())
      .then((data) => data as Page[])
      .then((data) => {
        console.log(data);
        const pgs = new Array<Page>();
        data.forEach((p) => pgs.push({ id: p.id, title: p.title, dateCreated: p.dateCreated, lastEdited: p.lastEdited }));
        setPages(pgs);
        if (pgs.length > 0 && page.id === "-1") {
          setPage({id: pgs[0].id, title: pgs[0].title, dateCreated: pgs[0].dateCreated, lastEdited: pgs[0].lastEdited});
        }
      })
      .catch((e) => {
        setPage({id: "-1", title: "Error", dateCreated: "", lastEdited: "Error"});
        console.error(e);
      });
  }, [fetchSwitch, noteBook, page]);

  const addPage = () => {
    if (!isSaved) {
      alert("save before adding a new page!");
      return;
    }
    fetch(notahApi + noteBook.id, {
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
        if (data) setPage({id: data.id, title: data.title, dateCreated: data.dateCreated, lastEdited: data.lastEdited});
        setFetchSwitch((prevState) => !prevState);
      })
      .catch((_) => {
        console.log("Failed to add page");
      });
  };

  const deletePage = (id: string) => {
    fetch(notahApi + id, {
      method: "DELETE",
      credentials: 'include',
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
      <div className="h-full flex-1 overflow-auto">
        <button
          className="hover:bg-gray-200 active:bg-gray-300 whitespace-nowrap border-b-2 p-1 w-full font-bold text-amber-500"
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
                lastEdited={p.lastEdited}
                deletePage={deletePage}
              />
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
