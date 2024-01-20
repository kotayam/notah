import { useEffect, useState } from "react";
import Canvas from "./Canvas";
import Notes from "./Notes";
import Toolbar from "./Toolbar";
import API from "./API.json";
import { useDispatch } from "react-redux";
import { actionCreators } from "./store";
import { bindActionCreators } from "@reduxjs/toolkit";

const apiLink = API["isDev"] ? API["API"]["dev"] : API["API"]["production"];

export default function Notah() {
  const dispatch = useDispatch();
  const { setAccount } = bindActionCreators(actionCreators, dispatch);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch(apiLink + `Authentication/refreshToken`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.status) {
          throw new Error();
        }
        setAccount({
          id: data.id,
          username: data.username,
          email: data.email,
          dateCreated: data.dateCreated,
          lastEdited: data.lastEdited,
          role: data.role,
          aiUsageLimit: data.aiUsageLimit,
        });
        setChecking(false);
      })
      .catch((_) => {
        window.location.href = "/login?status=error";
      });
  }, []);

  const renderNotah = () => {
    return (
      <div className="bg-amber-50 mobile:text-sm">
        <Toolbar />
        <div className="flex h-full">
          <Notes />
          <Canvas />
        </div>
      </div>
    );
  };

  const renderChecking = () => {
    return (
      <div className="bg-gradient-to-br from-yellow-200 via-amber-600 to-red-600 bg-[length:400%_400%] min-h-[100vh] flex justify-center items-center animate-gradient text-lg mobile:text-md">
        <div className="grid grid-cols-1 gap-2 place-content-center text-center text-white">
          <h1 className="text-2xl mobile:text-xl animate-bounce">Loading...</h1>
          <img
            src="/notah-logo.gif"
            alt="Notah Logo"
            className="w-80 mobile:w-40"
          />
        </div>
      </div>
    );
  };

  return checking ? renderChecking() : renderNotah();
}
