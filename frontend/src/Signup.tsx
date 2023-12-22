import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { actionCreators } from "./store";
import { bindActionCreators } from "@reduxjs/toolkit";
import API from "./API.json";

const apiLink = API["isDev"]? API["API"]["dev"] : API["API"]["production"];

export default function Signup() {
  const dispatch = useDispatch();
  const { resetState } = bindActionCreators(actionCreators, dispatch);

  const [display, setDisplay] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    resetState();
  }, []);

  const displayErrorMessage = (msg: string) => {
    setErrMsg(msg);
    setDisplay(true);
    setTimeout(() => {
      setDisplay(false);
    }, 3000);
  };

  const createAccount = () => {
    const username = document.getElementById(
      "username"
    ) as HTMLInputElement | null;
    const email = document.getElementById("email") as HTMLInputElement | null;
    const password = document.getElementById(
      "password"
    ) as HTMLInputElement | null;
    const confirmPass = document.getElementById(
      "confirm-password"
    ) as HTMLInputElement | null;
    if (!(username && email && password && confirmPass)) {
      displayErrorMessage("*Something went wrong, please try again later");
      return;
    }
    if (
      !(username.value && email.value && password.value && confirmPass.value)
    ) {
      displayErrorMessage("*Please fill out all fields");
      return;
    }
    let usernameChecker = new RegExp(/^[a-zA-Z0-9]+$/i);
    if (!usernameChecker.test(username.value)) {
      displayErrorMessage("*Username can only contain alphanumeric characters");
      return;
    }
    let emailChecker = new RegExp(/^.+\@.+\..+$/i);
    if (!emailChecker.test(email.value)) {
      displayErrorMessage("*Invalid email format");
      return;
    }
    if (password.value !== confirmPass.value) {
      displayErrorMessage("*Password does not match");
      return;
    }
    setLoading(true);
    fetch(apiLink + "Accounts", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username.value,
        email: email.value,
        password: password.value,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        console.log(data);
        if (data.status === 400) {
          displayErrorMessage("*Username already exists");
          return;
        }
        window.location.href = "/login";
      })
      .catch((e) => {
        setLoading(false);
        console.error(e);
        displayErrorMessage("*Failed to create account");
      });
  };
  return (
    <>
      <div className="bg-gradient-to-br from-yellow-200 via-amber-600 to-red-600 bg-[length:400%_400%] min-h-[100vh] flex justify-center items-center animate-gradient mobile:text-sm">
        <div className="bg-white p-2 rounded-xl h-fit min-w-[400px]">
          <h1 className="mt-5 mb-5 text-center font-semibold text-2xl mobile:text-xl">
            Sign Up
          </h1>
          <p
            className="text-red-600 ml-5"
            style={{ display: display ? "block" : "none" }}
          >
            {errMsg}
          </p>
          <div className="grid grid-cols-1 gap-4 place-content-center ml-5 mr-5">
            <div className="grid grid-cols-1 content-start gap-1">
              <label htmlFor="username">Username</label>
              <div className="flex justify-content">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  data-slot="icon"
                  className="w-5 mr-2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                  />
                </svg>
                <input
                  id="username"
                  type="text"
                  maxLength={20}
                  placeholder="Type your username"
                />
              </div>
              <hr />
            </div>
            <div className="grid grid-cols-1 content-start gap-1">
              <label htmlFor="email">Email</label>
              <div className="flex justify-content">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  data-slot="icon"
                  className="w-5 mr-2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                  />
                </svg>
                <input id="email" type="email" placeholder="Type your email" />
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
                  stroke-width="1.5"
                  stroke="currentColor"
                  data-slot="icon"
                  className="w-5 mr-2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                  />
                </svg>
                <input
                  id="password"
                  type="password"
                  placeholder="Type your password"
                />
              </div>
              <hr />
            </div>
            <div className="grid grid-cols-1 content-start gap-1">
              <label htmlFor="confirm-password">Confirm Password</label>
              <div className="flex justify-content">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  data-slot="icon"
                  className="w-5 mr-2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                  />
                </svg>
                <input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm your password"
                />
              </div>
              <hr />
            </div>
            <button
              className={`mt-3 rounded-lg p-2 hover:bg-amber-300 active:bg-amber-400 bg-amber-200 flex justify-center`}
              onClick={() => createAccount()}
            >
              <p
                className="font-medium"
                style={{ display: loading ? "none" : "flex" }}
              >
                Sign Up
              </p>
              <div
                className="rounded-full border-4 border-solid h-6 w-6 border-r-transparent border-blue-500 animate-spin"
                style={{ display: loading ? "flex" : "none" }}
              ></div>
            </button>
            <div className="mt-5 text-center flex justify-center">
              <p>Already Have an Account?&nbsp;</p>
              <a
                className="text-center text-blue-600 font-semibold hover:underline"
                href="/login"
              >
                Login
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
