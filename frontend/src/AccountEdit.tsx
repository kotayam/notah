import { FormEvent, useState } from "react";
import API from "./API.json";
import { useDispatch, useSelector } from "react-redux";
import { actionCreators, rootState } from "./store";
import { bindActionCreators } from "@reduxjs/toolkit";

const apiLink = API["isDev"] ? API["API"]["dev"] : API["API"]["production"];

export default function AccountEdit() {
  const account = useSelector((root: rootState) => root.account);
  const dispatch = useDispatch();
  const { setAccount } = bindActionCreators(actionCreators, dispatch);
  const [errMsg, setErrMsg] = useState("");
  const [display, setDisplay] = useState(false);

  const displayErrorMessage = (msg: string) => {
    setErrMsg(msg);
    setDisplay(true);
    setTimeout(() => {
      setDisplay(false);
    }, 3000);
  };

  const saveChanges = (e: FormEvent) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      username: { value: string };
      email: { value: string };
    };
    const username = target.username.value || account.username;
    const email = target.email.value || account.email;
    if (username === account.username && email === account.email) {
      displayErrorMessage("*There is no change to make");
      target.username.value = "";
      target.email.value = "";
      return;
    }
    target.username.value = "";
    target.email.value = "";
    fetch(apiLink + `Accounts/${account.id}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: username, email: email }),
    })
      .then((res) => res.json())
      .then((data) => {
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
              console.log("session extended");
              fetch(apiLink + `Accounts/${account.id}`, {
                method: "PUT",
                credentials: "include",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ username: username, email: email }),
              })
                .then((res) => res.json())
                .then((data) => {
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
                });
            }
          })
          .catch((e) => {
            console.error(e);
            window.location.href = "/login?status=timeout";
          });
      });
  };

  const changePassword = (e: FormEvent) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      currPass: { value: string };
      newPass: { value: string };
    };
    const currPass = target.currPass.value;
    const newPass = target.newPass.value;
    if (!(currPass || newPass)) {
      displayErrorMessage("*There is no change to make");
      return;
    }
    fetch(apiLink + `Accounts/changePassword/${account.id}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ currPassword: currPass, newPassword: newPass }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.status === 400) {
          displayErrorMessage("*Incorrect password, try again");
          return;
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
            }
          })
          .catch((e) => {
            console.error(e);
            window.location.href = "/login?status=timeout";
          });
      });
  };

  return (
    <div className="grid grid-cols-1 p-2 gap-2">
      <p
        className="text-red-600"
        style={{ display: display ? "block" : "none" }}
      >
        {errMsg}
      </p>
      <form className="grid grid-cols-1 gap-2" onSubmit={(e) => saveChanges(e)}>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <div>Current Username:</div>
            <div>{account.username}</div>
          </div>
          <div className="grid grid-cols-1">
            <label htmlFor="username">New Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="New Username"
              className="bg-gray-200"
            />
          </div>
          <div>
            <div>Current Email:</div>
            <div>{account.email}</div>
          </div>
          <div className="grid grid-cols-1">
            <label htmlFor="email">New Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="New Email"
              className="bg-gray-200"
            />
          </div>
        </div>
        <div className="flex justify-end items-center">
          <button
            type="submit"
            className="hover:bg-amber-300 active:bg-amber-400 bg-amber-200 rounded-md p-1 font-semibold"
          >
            Save Changes
          </button>
        </div>
      </form>
      <hr />
      <form
        className="grid grid-cols-1 gap-2"
        onSubmit={(e) => changePassword(e)}
      >
        <div className="grid grid-cols-2 gap-2">
          <div className="grid grid-cols-1">
            <label htmlFor="currPass">Current Password:</label>
            <input
              type="password"
              id="currPass"
              name="currPass"
              placeholder="Current Password"
              className="bg-gray-200"
            />
          </div>
          <div className="grid grid-cols-1">
            <label htmlFor="newPass">New Password:</label>
            <input
              type="password"
              id="newPass"
              name="newPass"
              placeholder="New Password"
              className="bg-gray-200"
            />
          </div>
        </div>
        <div className="flex justify-end items-center">
          <button
            type="submit"
            className="hover:bg-amber-300 active:bg-amber-400 bg-amber-200 rounded-md p-1 font-semibold"
          >
            Change Password
          </button>
        </div>
      </form>
    </div>
  );
}
