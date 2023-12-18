import { useState } from "react";
import { useDispatch } from "react-redux";
import { actionCreators } from "./store";
import { bindActionCreators } from "@reduxjs/toolkit";

const notahApi = "http://localhost:5245/api/v1/Login";

type Account = {
  id: string;
  username: string;
  email: string;
  password: string;
  dateCreated: string;
  lastEdited: string;
};

export default function Login() {
  const dispatch = useDispatch();
  const { setAccount } = bindActionCreators(actionCreators, dispatch);
  const [display, setDisplay] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [loginStatus, setLoginStatus] = useState("Login");

  const displayErrorMessage = (msg: string) => {
    setErrMsg(msg);
    setDisplay(true);
    setTimeout(() => {
      setDisplay(false);
    }, 3000);
  };

  const login = () => {
    const email = document.getElementById("email") as HTMLInputElement | null;
    const password = document.getElementById(
      "password"
    ) as HTMLInputElement | null;
    if (!(email && password)) {
      displayErrorMessage("*Failed to login");
      return;
    }
    if (!(email.value && password.value)) {
      displayErrorMessage("*Please fill out all fields");
      return;
    }
    setLoginStatus("Logging in...");
    fetch(notahApi, {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email.value, password: password.value }),
    })
      .then((res) => res.json())
      .then((data) => {
        setLoginStatus("Login");
        if (data.status === 404) {
          displayErrorMessage("*Email or password is incorrect");
          return;
        } else {
          data = data as Account;
        }
        console.log(data);
        setAccount({
          id: data.id,
          username: data.username,
          access: "user",
          dateCreated: data.dateCreated,
          lastEdited: data.lastEdited,
        });
        window.location.href = `/${data.username}`;
      })
      .catch((e) => {
        setLoginStatus("Login");
        console.error(e);
        displayErrorMessage("*Failed to login");
      });
  };
  return (
    <>
      <div className="bg-gradient-to-br from-yellow-200 via-amber-600 to-red-600 bg-[length:400%_400%] min-h-[100vh] flex justify-center animate-gradient flext justify-content items-center">
        <div className="bg-white p-2 rounded-xl h-fit min-w-[400px]">
          <h2 className="mt-5 mb-5 text-center font-semibold text-2xl">
            Login
          </h2>
          <p
            className="text-red-600 ml-5"
            style={{ display: display ? "block" : "none" }}
          >
            {errMsg}
          </p>
          <div className="grid grid-cols-1 gap-4 place-content-center ml-5 mr-5">
            <div className="grid grid-cols-1 content-start gap-1">
              <label htmlFor="email">Email</label>
              <input
                className=""
                id="email"
                type="email"
                placeholder="Type your email"
              />
              <hr />
            </div>
            <div className="grid grid-cols-1 content-start gap-1">
              <label htmlFor="password">Password</label>
              <input
                className=""
                id="password"
                type="password"
                placeholder="Type your password"
              />
              <hr />
            </div>
            <button
              className="mt-3 rounded-lg p-2 font-medium hover:bg-amber-300 active:bg-amber-400 bg-amber-200"
              onClick={() => login()}
            >
              {loginStatus}
            </button>
            <div className="mt-5 text-center flex justify-center">
              <p>New to Notah?&nbsp;</p>
              <a
                className="text-center text-blue-600 font-semibold hover:underline"
                href="/create-account"
              >
                Sign Up
              </a>
            </div>
            <hr />
            <a className="text-center hover:underline mb-5" href="/">
              Return To Home
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
