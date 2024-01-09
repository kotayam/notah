import { useSelector } from "react-redux";
import { rootState } from "./store";
import { FormEvent, useState } from "react";
import API from "./API.json";

const apiLink = API["isDev"] ? API["API"]["dev"] : API["API"]["production"];

export default function AccountDelete() {
  const account = useSelector((root: rootState) => root.account);
  const [deleting, setDeleting] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [display, setDisplay] = useState(false);

  const displayErrorMessage = (msg: string) => {
    setErrMsg(msg);
    setDisplay(true);
    setTimeout(() => {
      setDisplay(false);
    }, 3000);
  };

  const deleteAccount = (e: FormEvent) => {
    e.preventDefault();
    setDeleting(false);
    const target = e.target as typeof e.target & {
      confirmDelete: { value: string };
    };
    const confirmDelete = target.confirmDelete.value;
    if (confirmDelete !== `DELETE ${account.username}`) {
      target.confirmDelete.value = "";
      displayErrorMessage("*Wront input, failed to delete account");
      return;
    }
    target.confirmDelete.value = "";
    fetch(apiLink + `Accounts/${account.id}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.status) {
          displayErrorMessage("Something went wrong, try again later");
          return;
        } else {
          window.location.href = "/";
        }
      })
      .catch((e) => {
        console.error(e);
        window.location.href = "/login?error=timeout";
      });
  };
  return (
    <div className="p-2 grid grid-cols-1 gap-1">
      <div>
        Once you delete your account, there is no going back. Please be certain.
      </div>
      <p
        className="text-red-600"
        style={{ display: display ? "block" : "none" }}
      >
        {errMsg}
      </p>
      <form
        className="grid grid-cols-1 gap-1 border-2 p-1 border-red-500"
        style={{ display: deleting ? "" : "none" }}
        autoComplete="off"
        onSubmit={(e) => deleteAccount(e)}
      >
        <label htmlFor="confirmDelete">{`Type "DELETE ${account.username}" to delete your account`}</label>
        <input
          type="text"
          id="confirmDelete"
          name="confirmDelete"
          placeholder={`DELETE ${account.username}`}
          className="bg-gray-200"
        />
        <div className="flex justify-end">
          <button
            type="submit"
            className="hover:bg-amber-300 active:bg-amber-400 bg-amber-200 rounded-md p-1 font-semibold"
          >
            Delete Account
          </button>
        </div>
      </form>
      <div
        className="flex justify-end"
        style={{ display: deleting ? "none" : "" }}
      >
        <button
          className="hover:bg-amber-300 active:bg-amber-400 bg-amber-200 rounded-md p-1 font-semibold"
          onClick={() => setDeleting(true)}
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}
