import { useEffect, useState } from "react";
import Page from "./Page";
import { useSelector, useDispatch } from "react-redux";
import { rootState, actionCreators } from "./store";
import { bindActionCreators } from "@reduxjs/toolkit";
import refreshToken from "./Authentication";
import API from "./API.json";

const apiLink = API["isDev"] ? API["API"]["dev"] : API["API"]["production"];

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
  const [loadingGet, setLoadingGet] = useState(false);
  const [loadingAdd, setLoadingAdd] = useState(false);

  useEffect(() => {
    if (noteBook.id === "-1") {
      return;
    }
    setLoadingGet(true);
    fetch(apiLink + `Pages/byNoteBookId/${noteBook.id}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => data as Page[])
      .then((data) => {
        console.log(data);
        const pgs = new Array<Page>();
        data.forEach((p) =>
          pgs.push({
            id: p.id,
            title: p.title,
            dateCreated: p.dateCreated,
            lastSaved: p.lastSaved,
          })
        );
        setPages(pgs);
        if (pgs.length > 0 && page.id === "-1") {
          setPage({
            id: pgs[0].id,
            title: pgs[0].title,
            dateCreated: pgs[0].dateCreated,
            lastSaved: pgs[0].lastSaved,
          });
        }
        setLoadingGet(false);
      })
      .catch(async (_) => {
        const authorized = await refreshToken();
        if (authorized) {
          fetch(apiLink + `Pages/byNoteBookId/${noteBook.id}`, {
            credentials: "include",
          })
            .then((res) => res.json())
            .then((data) => data as Page[])
            .then((data) => {
              console.log(data);
              const pgs = new Array<Page>();
              data.forEach((p) =>
                pgs.push({
                  id: p.id,
                  title: p.title,
                  dateCreated: p.dateCreated,
                  lastSaved: p.lastSaved,
                })
              );
              setPages(pgs);
              if (pgs.length > 0 && page.id === "-1") {
                setPage({
                  id: pgs[0].id,
                  title: pgs[0].title,
                  dateCreated: pgs[0].dateCreated,
                  lastSaved: pgs[0].lastSaved,
                });
              }
              setLoadingGet(false);
            })
            .catch((_) => {
              window.location.href = "/login?status=error";
            });
        }
      });
  }, [fetchSwitch, noteBook, page.title]);

  const addPage = () => {
    if (!isSaved) {
      alert("save before adding a new page!");
      return;
    }
    setLoadingAdd(true);
    fetch(apiLink + `Pages/${noteBook.id}`, {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: `Page ${pages.length}` }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 404) {
          setLoadingAdd(false);
          alert("Select a notebook to add a new page!");
          return;
        } else return data as Page;
      })
      .then((data) => {
        console.log(data);
        if (data)
          setPage({
            id: data.id,
            title: data.title,
            dateCreated: data.dateCreated,
            lastSaved: data.lastSaved,
          });
        setFetchSwitch((prevState) => !prevState);
        setLoadingAdd(false);
      })
      .catch(async (_) => {
        const authorized = await refreshToken();
        if (authorized) {
          fetch(apiLink + `Pages/${noteBook.id}`, {
            method: "POST",
            credentials: "include",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ title: `Page ${pages.length}` }),
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.status === 404) {
                setLoadingAdd(false);
                alert("Select a notebook to add a new page!");
                return;
              } else return data as Page;
            })
            .then((data) => {
              console.log(data);
              if (data)
                setPage({
                  id: data.id,
                  title: data.title,
                  dateCreated: data.dateCreated,
                  lastSaved: data.lastSaved,
                });
              setFetchSwitch((prevState) => !prevState);
              setLoadingAdd(false);
            })
            .catch((_) => {
              window.location.href = "/login?status=error";
            });
        }
      });
  };

  const deletePage = (id: string) => {
    fetch(apiLink + `Pages/${id}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setFetchSwitch((prevState) => !prevState);
        setPage({
          id: pages[0].id,
          title: pages[0].title,
          dateCreated: pages[0].dateCreated,
          lastSaved: pages[0].lastSaved,
        });
      })
      .catch(async (_) => {
        const authorized = await refreshToken();
        if (authorized) {
          fetch(apiLink + `Pages/${id}`, {
            method: "DELETE",
            credentials: "include",
          })
            .then((res) => res.json())
            .then((data) => {
              console.log(data);
              setFetchSwitch((prevState) => !prevState);
              setPage({
                id: pages[0].id,
                title: pages[0].title,
                dateCreated: pages[0].dateCreated,
                lastSaved: pages[0].lastSaved,
              });
            })
            .catch((_) => {
              window.location.href = "/login?status=error";
            });
        }
      });
  };

  return (
    <>
      <div className="h-full flex-1 overflow-scroll">
        <button
          className="hover:bg-gray-200 active:bg-gray-300 whitespace-nowrap mobile:whitespace-normal w-full border-b-2 p-1 font-bold text-amber-500 text-center flex items-center"
          style={{ justifyContent: loadingAdd ? "center" : "" }}
          onClick={() => addPage()}
        >
          <p style={{ display: loadingAdd ? "none" : "flex" }}>+ Add Page</p>
          <div
            className="rounded-full border-4 border-solid h-6 w-6 border-r-transparent border-blue-500 animate-spin"
            style={{ display: loadingAdd ? "flex" : "none" }}
          ></div>
        </button>
        <div
          className={loadingGet ? "flex justify-center items-center py-8" : ""}
        >
          <ul style={{ display: loadingGet ? "none" : "block" }}>
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
          <div
            className="rounded-full border-4 border-solid h-6 w-6 border-r-transparent border-blue-500 animate-spin"
            style={{ display: loadingGet ? "block" : "none" }}
          ></div>
        </div>
      </div>
    </>
  );
}
