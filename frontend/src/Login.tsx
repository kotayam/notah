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

  const login = () => {
    const email = document.getElementById("email") as HTMLInputElement | null;
    const password = document.getElementById(
      "password"
    ) as HTMLInputElement | null;
    if (!(email && password)) {
      return;
    }
    if (email.value && password.value) {
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
          if (data.status === 404) throw new Error();
          else return data as Account;
        })
        .then((data) => {
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
          console.log("failed to login");
          console.error(e);
        });
    } else {
      console.log("Please fill out all fields");
      return;
    }
  };
  return (
    <>
      <div className="bg-amber-100 h-screen flex justify-center pt-10">
        <div className="bg-white p-2 rounded-xl h-fit min-w-[400px]">
          <h2 className="mt-5 mb-5 text-center font-semibold text-2xl">
            Login
          </h2>
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
              className="mt-3 rounded-lg p-2 font-medium hover:bg-amber-200 active:bg-amber-300 bg-amber-100 "
              onClick={() => login()}
            >
              Login
            </button>
            <div className="mt-5 text-center">Or Sign Up Using</div>
            <a className="text-center hover:underline" href="/create-account">
              SIGN UP
            </a>
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
