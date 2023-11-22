import { useEffect, useState } from "react";
import NoteBook from "./NoteBook";
import { useSelector, useDispatch } from "react-redux";
import { rootState, actionCreators } from "./store";
import { bindActionCreators } from "@reduxjs/toolkit";

const notahApi = "http://localhost:5245/api/v1/NoteBooks/";

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
  const dispatch = useDispatch();
  const { setNoteBook, setPage } = bindActionCreators(actionCreators, dispatch);

  useEffect(() => {
    // if (!itemAdded && noteBooks.length) {
    //     return;
    // }
    fetch(notahApi + "byOwnerId/" + account.id)
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
        console.error(e);
      });
  }, [fetchSwitch]);

  const addNoteBook = () => {
    fetch(notahApi + account.id, {
      method: "POST",
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
        setPage({id: "-1", title: "default", dateCreated: "default", lastEdited: "default"});
        setFetchSwitch((prevState) => !prevState);
      })
      .catch((_) => {
        console.log("Failed to add notebook");
      });
  };

  const deleteNotebook = (id: string) => {
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
      <div className="h-full flex-1 border-r-2">
        <button
          className="hover:bg-gray-200 active:bg-gray-300 whitespace-nowrap overflow-auto p-1 border-b-2 w-full font-bold text-amber-500"
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
