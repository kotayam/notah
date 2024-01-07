import { useEffect, useState } from "react";
import NoteBook from "./NoteBook";
import { useSelector, useDispatch } from "react-redux";
import { rootState, actionCreators } from "./store";
import { bindActionCreators } from "@reduxjs/toolkit";
import API from "./API.json";

const apiLink = API["isDev"]? API["API"]["dev"] : API["API"]["production"];

type NoteBook = {
  id: string;
  title: string;
  dateCreated: string;
  lastEdited: string;
};

export default function NoteBooks() {
  const [noteBooks, setNoteBooks] = useState<NoteBook[]>([]);
  const [fetchSwitch, setFetchSwitch] = useState(false);
  const account = useSelector((state: rootState) => state.account);
  const noteBook = useSelector((state: rootState) => state.noteBook);
  const isSaved = useSelector((state: rootState) => state.isSaved);
  const dispatch = useDispatch();
  const { setNoteBook, setPage } = bindActionCreators(actionCreators, dispatch);

  useEffect(() => {
    if (account.id === "-1") {
      window.location.href = "/login";
    }
    fetch(apiLink + `NoteBooks/byOwnerId/${account.id}`, {
      credentials: 'include'
    })
      .then((res) => res.json())
      .then((data) => data as NoteBook[])
      .then((data) => {
        console.log(data);
        const nbs = new Array<NoteBook>();
        data.forEach((nb) => nbs.push({ id: nb.id, title: nb.title, dateCreated: nb.dateCreated, lastEdited: nb.lastEdited }));
        setNoteBooks(nbs);
        if (nbs.length > 0 && noteBook.id === "-1") {
          setNoteBook({id: nbs[0].id, title: nbs[0].title, dateCreated: nbs[0].dateCreated, lastEdited: nbs[0].lastEdited});
        }
      })
      .catch((e) => {
        setNoteBook({id: "-1", title: "Error", dateCreated: "", lastEdited: ""})
        console.error(e);
      });
  }, [fetchSwitch]);

  const addNoteBook = () => {
    if (!isSaved) {
      alert("save before adding a new notebook!");
      return;
    }
    fetch(apiLink + `NoteBooks/${account.id}`, {
      method: "POST",
      credentials: 'include',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: `Notebook ${noteBooks.length}` }),
    })
      .then((res) => res.json())
      .then(data => {
        if (data.status === 404) {
          alert("Login to add notebook!");
          return;
        }
        else {
          return data as NoteBook;
        }
        })
      .then((data) => {
        console.log(data);
        if (data) setNoteBook({id: data.id, title: data.title, dateCreated: data.dateCreated, lastEdited: data.lastEdited});
        setPage({id: "-1", title: "default", dateCreated: "default", lastSaved: "default"});
        setFetchSwitch((prevState) => !prevState);
      })
      .catch((_) => {
        console.log("Failed to add notebook");
      });
  };

  const deleteNotebook = (id: string) => {
    fetch(apiLink + `NoteBooks/${id}`, {
      method: "DELETE",
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setFetchSwitch((prevState) => !prevState);
        setNoteBook({id: noteBooks[0].id, title: noteBooks[0].title, dateCreated: noteBooks[0].dateCreated, lastEdited: noteBooks[0].lastEdited});
      })
      .catch((e) => {
        console.error(e);
      });
  };

  return (
    <>
      <div className="h-full flex-1 border-r-2 overflow-scroll">
        <button
          className="hover:bg-gray-200 active:bg-gray-300 whitespace-nowrap mobile:whitespace-normal w-full p-1 border-b-2 font-bold text-amber-500 text-center"
          onClick={() => addNoteBook()}
        >
          + Add Notebook
        </button>
        <div>
          <ul>
            {noteBooks.map((nb) => (
              <NoteBook
                key={nb.id}
                id={nb.id}
                title={nb.title}
                dateCreated={nb.dateCreated}
                lastEdited={nb.lastEdited}
                deleteNotebook={deleteNotebook}
              />
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
