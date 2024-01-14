import { useState, MouseEvent, KeyboardEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PageProps } from "./Props";
import { actionCreators, rootState } from "./store";
import { bindActionCreators } from "@reduxjs/toolkit";
import API from "./API.json";

const apiLink = API["isDev"]? API["API"]["dev"] : API["API"]["production"];

export default function Page({
  id,
  title,
  dateCreated,
  lastSaved,
  deletePage,
}: PageProps) {
  const page = useSelector((state: rootState) => state.page);
  const isSaved = useSelector((state: rootState) => state.isSaved);
  const dispatch = useDispatch();
  const { setPage } = bindActionCreators(actionCreators, dispatch);
  const [rename, setRename] = useState(false);

  let hoverStyle = "hover:bg-gray-200";
  let bgStyle = "";
  if (page.id === id) {
    hoverStyle = "";
    bgStyle = "bg-gray-300";
  }

  const handleClick = (e: MouseEvent) => {
    if (!isSaved) {
      alert("save before switching pages!");
      return;
    }
    setPage({
      id: id,
      title: title,
      dateCreated: dateCreated,
      lastSaved: lastSaved,
    });
    switch (e.button) {
      case 0:
        setRename(false);
        break;
      case 2:
        setRename(true);
        break;
      default:
        return;
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      const input = document.getElementById(id) as HTMLInputElement;
      if (!input) return;
      fetch(apiLink + `Pages/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: input.value }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setRename(false);
          setPage({
            id: data.id,
            title: data.title,
            dateCreated: data.dateCreated,
            lastSaved: data.lastSaved,
          });
        })
        .catch((e) => {
          console.error(e);
          fetch(apiLink + `Authentication/refreshToken`, {
            credentials: "include",
          })
            .then((data) => {
              console.log(data);
              if (!data.ok) {
                window.location.href = "/login?status=timeout";
              } else {
                console.log("Session extended");
              }
            })
            .catch((e) => {
              console.error(e);
              window.location.href = "/login?status=timeout";
            });
        });
    }
  };

  const returnPage = () => {
    if (rename && id === page.id) {
      return (
        <li className={`p-1 overflow-hidden ${bgStyle}`}>
          <input
            id={id}
            className="w-2/3"
            type="text"
            onKeyDown={(e) => handleKeyDown(e)}
            placeholder={title}
          />
          <button className="float-right mr-2" onClick={() => deletePage(id)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="20"
              height="20"
              viewBox="0 0 48 48"
            >
              <path d="M 24 4 C 20.491685 4 17.570396 6.6214322 17.080078 10 L 10.238281 10 A 1.50015 1.50015 0 0 0 9.9804688 9.9785156 A 1.50015 1.50015 0 0 0 9.7578125 10 L 6.5 10 A 1.50015 1.50015 0 1 0 6.5 13 L 8.6386719 13 L 11.15625 39.029297 C 11.427329 41.835926 13.811782 44 16.630859 44 L 31.367188 44 C 34.186411 44 36.570826 41.836168 36.841797 39.029297 L 39.361328 13 L 41.5 13 A 1.50015 1.50015 0 1 0 41.5 10 L 38.244141 10 A 1.50015 1.50015 0 0 0 37.763672 10 L 30.919922 10 C 30.429604 6.6214322 27.508315 4 24 4 z M 24 7 C 25.879156 7 27.420767 8.2681608 27.861328 10 L 20.138672 10 C 20.579233 8.2681608 22.120844 7 24 7 z M 11.650391 13 L 36.347656 13 L 33.855469 38.740234 C 33.730439 40.035363 32.667963 41 31.367188 41 L 16.630859 41 C 15.331937 41 14.267499 40.033606 14.142578 38.740234 L 11.650391 13 z M 20.476562 17.978516 A 1.50015 1.50015 0 0 0 19 19.5 L 19 34.5 A 1.50015 1.50015 0 1 0 22 34.5 L 22 19.5 A 1.50015 1.50015 0 0 0 20.476562 17.978516 z M 27.476562 17.978516 A 1.50015 1.50015 0 0 0 26 19.5 L 26 34.5 A 1.50015 1.50015 0 1 0 29 34.5 L 29 19.5 A 1.50015 1.50015 0 0 0 27.476562 17.978516 z"></path>
            </svg>
          </button>
        </li>
      );
    } else {
      return (
        <li
          className={`${hoverStyle} overflow-auto whitespace-nowrap active:bg-gray-300 p-1 ${bgStyle}`}
          onClick={(e) => {
            handleClick(e);
          }}
          onContextMenu={(e) => {
            e.preventDefault();
            handleClick(e);
          }}
        >
          {title}
        </li>
      );
    }
  };

  return <>{returnPage()}</>;
}
