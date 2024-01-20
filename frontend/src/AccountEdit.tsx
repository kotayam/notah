import { FormEvent, useState } from "react";
import API from "./API.json";
import { useDispatch, useSelector } from "react-redux";
import { actionCreators, rootState } from "./store";
import { bindActionCreators } from "@reduxjs/toolkit";
import refreshToken from "./Authentication";
import { DISPLAY } from "html2canvas/dist/types/css/property-descriptors/display";

const apiLink = API["isDev"] ? API["API"]["dev"] : API["API"]["production"];

export default function AccountEdit() {
  const account = useSelector((root: rootState) => root.account);
  const dispatch = useDispatch();
  const { setAccount } = bindActionCreators(actionCreators, dispatch);
  const [errMsg, setErrMsg] = useState("");
  const [display, setDisplay] = useState(false);
  const [updatingAccount, setUpdatingAccount] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [textColor, setTextColor] = useState("");

  const displayErrorMessage = (msg: string, error: boolean) => {
    if (error) setTextColor("text-red-600");
    else setTextColor("text-blue-600");
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
      displayErrorMessage("*There is no change to make", true);
      target.username.value = "";
      target.email.value = "";
      return;
    }
    target.username.value = "";
    target.email.value = "";
      setUpdatingAccount(true);
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
        setUpdatingAccount(false);
        displayErrorMessage("Successfully updated account information", false);
        fetch(apiLink + `Mail/SendMail`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            emailToAddress: data.email,
            emailToName: data.username,
            emailPurpose: "account-update",
          }),
        }).catch((_) => {
          console.log("send email failed");
        });
      })
      .catch(async (_) => {
        const authorized = await refreshToken();
        if (authorized) {
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
              setUpdatingAccount(false);
              displayErrorMessage(
                "Successfully updated account information",
                false
              );
              fetch(apiLink + `Mail/SendMail`, {
                method: "POST",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  emailToAddress: data.email,
                  emailToName: data.username,
                  emailPurpose: "account-update",
                }),
              }).catch((_) => {
                console.log("send email failed");
              });
            })
            .catch((_) => {
              setUpdatingAccount(false);
              displayErrorMessage(
                "Something went wrong, try again later",
                true
              );
            });
        }
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
    if (!currPass || !newPass) {
      displayErrorMessage("*There is no change to make", true);
      return;
    }
    target.currPass.value = "";
    target.newPass.value = "";
    setChangingPassword(true);
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
          setChangingPassword(false);
          displayErrorMessage("*Incorrect password, try again", true);
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
        setChangingPassword(false);
        displayErrorMessage("Successfully changed password", false);
        fetch(apiLink + `Mail/SendMail`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            emailToAddress: data.email,
            emailToName: data.username,
            emailPurpose: "password-change",
          }),
        }).catch((_) => {
          console.log("send email failed");
        });
      })
      .catch(async (_) => {
        const authorized = await refreshToken();
        if (authorized) {
          fetch(apiLink + `Accounts/changePassword/${account.id}`, {
            method: "PUT",
            credentials: "include",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              currPassword: currPass,
              newPassword: newPass,
            }),
          })
            .then((res) => res.json())
            .then((data) => {
              console.log(data);
              if (data.status === 400) {
                setChangingPassword(false);
                displayErrorMessage("*Incorrect password, try again", true);
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
              setChangingPassword(false);
              displayErrorMessage("Successfully changed password", false);
              fetch(apiLink + `Mail/SendMail`, {
                method: "POST",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  emailToAddress: data.email,
                  emailToName: data.username,
                  emailPurpose: "password-change",
                }),
              }).catch((_) => {
                console.log("send email failed");
              });
            })
            .catch((_) => {
              setChangingPassword(false);
              displayErrorMessage(
                "Something went wrong, try again later",
                true
              );
            });
        }
      });
  };

  return (
    <div className="grid grid-cols-1 p-2 gap-2">
      <p
        className={`${textColor}`}
        style={{ display: display ? "block" : "none" }}
      >
        {errMsg}
      </p>
      <form className="grid grid-cols-1 gap-2" onSubmit={(e) => saveChanges(e)}>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <div>Current Username:</div>
            <div className="overflow-scroll">{account.username}</div>
          </div>
          <div className="grid grid-cols-1">
            <label htmlFor="username">New Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              maxLength={20}
              minLength={4}
              placeholder="New Username"
              className="bg-gray-200 outline-none p-1"
            />
          </div>
          <div>
            <div>Current Email:</div>
            <div className="overflow-scroll">{account.email}</div>
          </div>
          <div className="grid grid-cols-1">
            <label htmlFor="email">New Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="New Email"
              className="bg-gray-200 outline-none p-1"
            />
          </div>
        </div>
        <div className="flex justify-end items-center">
          <button
            type="submit"
            className="hover:bg-amber-300 active:bg-amber-400 bg-amber-200 rounded-md p-1 font-semibold"
          >
            <p style={{ display: updatingAccount ? "none" : "flex" }}>
              Save Changes
            </p>
            <div
              className="rounded-full border-4 border-solid h-5 w-5 border-r-transparent border-blue-500 animate-spin"
              style={{ display: updatingAccount ? "flex" : "none" }}
            ></div>
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
              className="bg-gray-200 outline-none p-1"
            />
          </div>
          <div className="grid grid-cols-1">
            <label htmlFor="newPass">New Password:</label>
            <input
              type="password"
              id="newPass"
              name="newPass"
              minLength={6}
              placeholder="New Password"
              className="bg-gray-200 outline-none p-1"
            />
          </div>
        </div>
        <div className="flex justify-end items-center">
          <button
            type="submit"
            className="hover:bg-amber-300 active:bg-amber-400 bg-amber-200 rounded-md p-1 font-semibold"
          >
            <p style={{ display: changingPassword ? "none" : "flex" }}>
            Change Password
            </p>
            <div
              className="rounded-full border-4 border-solid h-5 w-5 border-r-transparent border-blue-500 animate-spin"
              style={{ display: changingPassword ? "flex" : "none" }}
            ></div>
          </button>
        </div>
      </form>
    </div>
  );
}
