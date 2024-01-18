import { useEffect, useState, FormEvent } from "react";
import { useDispatch } from "react-redux";
import { actionCreators } from "./store";
import { bindActionCreators } from "@reduxjs/toolkit";
import API from "./API.json";
import { useSearchParams } from "react-router-dom";

const apiLink = API["isDev"] ? API["API"]["dev"] : API["API"]["production"];

type Account = {
  id: string;
  username: string;
  email: string;
  dateCreated: string;
  lastEdited: string;
  role: string;
  aiUsageLimit: number;
};

export default function Login() {
  const dispatch = useDispatch();
  const { setAccount, resetState } = bindActionCreators(
    actionCreators,
    dispatch
  );
  const [display, setDisplay] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [textColor, setTextColor] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    resetState();
  }, []);

  useEffect(() => {
    const status = searchParams.get("status");
    switch (status) {
      case "timeout":
        displayErrorMessage(
          "*Your session expired, recent changes might not be saved",
          true
        );
        setSearchParams("");
        break;
      case "signup-success":
        displayErrorMessage("Signed up successfully!", false);
        setSearchParams("");
        break;
      case "deleted":
        displayErrorMessage("Account deleted successfully", false);
        setSearchParams("");
        break;
      case "error":
        displayErrorMessage("*Something went wrong, try again later", true);
        setSearchParams("");
        break;
    }
  }, []);

  const displayErrorMessage = (msg: string, error: boolean) => {
    if (error) setTextColor("text-red-600");
    else setTextColor("text-blue-600");
    setErrMsg(msg);
    setDisplay(true);
    setTimeout(() => {
      setDisplay(false);
    }, 4000);
  };

  const login = (e: FormEvent) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      username: { value: string };
      password: { value: string };
    };
    const username = target.username.value;
    const password = target.password.value;
    if (!(username && password)) {
      displayErrorMessage("*Please fill out all fields", true);
      return;
    }
    setLoading(true);
    fetch(apiLink + "Authentication/login", {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        if (data.status === 404) {
          displayErrorMessage("*Account does not exist", true);
          return;
        } else if (data.status === 400) {
          displayErrorMessage("*Username or password is incorrect", true);
          return;
        }
        return data as Account;
      })
      .then((data) => {
        if (!data) return;
        console.log(data);
        setAccount({
          id: data.id,
          username: data.username,
          email: data.email,
          dateCreated: data.dateCreated,
          lastEdited: data.lastEdited,
          role: data.role,
          aiUsageLimit: data.aiUsageLimit,
        });
        window.location.href = `/notah`;
      })
      .catch((e: Error) => {
        setLoading(false);
        console.error(e);
        displayErrorMessage(
          "*Something went wrong, please try again later",
          true
        );
      });
  };
  return (
    <>
      <div className="bg-gradient-to-br from-yellow-200 via-amber-600 to-red-600 bg-[length:400%_400%] min-h-[100vh] flex justify-center items-center animate-gradient mobile:text-sm">
        <div className="bg-white p-2 rounded-xl h-fit min-w-[400px] mobile:min-w-[300px]">
          <h1 className="mt-5 mb-5 text-center font-semibold text-2xl mobile:text-xl">
            Login
          </h1>
          <p
            className={`ml-5 ${textColor}`}
            style={{ display: display ? "block" : "none" }}
          >
            {errMsg}
          </p>
          <form
            className="grid grid-cols-1 gap-4 place-content-center ml-5 mr-5"
            onSubmit={(e) => login(e)}
          >
            <div className="grid grid-cols-1 content-start gap-1">
              <label htmlFor="email">Username</label>
              <div className="flex justify-content">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  data-slot="icon"
                  className="w-5 mr-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                  />
                </svg>
                <input
                  id="username"
                  type="text"
                  maxLength={20}
                  placeholder="Type your username"
                  className="outline-none"
                />
              </div>
              <hr />
            </div>
            <div className="grid grid-cols-1 content-start gap-1">
              <label htmlFor="password">Password</label>
              <div className="flex justify-content">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  data-slot="icon"
                  className="w-5 mr-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                  />
                </svg>
                <input
                  id="password"
                  type="password"
                  placeholder="Type your password"
                  className="outline-none"
                />
              </div>
              <hr />
            </div>
            <button
              type="submit"
              className="mt-3 rounded-lg p-2 hover:bg-amber-300 active:bg-amber-400 bg-amber-200 flex justify-center"
            >
              <p
                className="font-medium"
                style={{ display: loading ? "none" : "flex" }}
              >
                Login
              </p>
              <div
                className="rounded-full border-4 border-solid h-6 w-6 border-r-transparent border-blue-500 animate-spin"
                style={{ display: loading ? "flex" : "none" }}
              ></div>
            </button>
            <div className="mt-5 text-center flex justify-center">
              <p>New to Notah?&nbsp;</p>
              <a
                className="text-center text-blue-600 font-semibold hover:underline"
                href="/signup"
              >
                Sign Up
              </a>
            </div>
            <div className="text-center flex justify-center">
              <p>Jot down a quick note?&nbsp;</p>
              <a
                className="text-center text-blue-600 font-semibold hover:underline"
                href="/memo"
              >
                Memo
              </a>
            </div>
            <hr />
            <a className="text-center hover:underline mb-5" href="/">
              Return To Home
            </a>
          </form>
        </div>
      </div>
    </>
  );
}
