import { useState } from "react";

const notahApi = "http://localhost:5245/api/v1/Accounts";

export default function CreateAccount() {
  const [display, setDisplay] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [signupStatus, setSignupStatus] = useState("Sign Up");

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
      displayErrorMessage("*Failed to create account");
      return;
    }
    if (
      !(username.value && email.value && password.value && confirmPass.value)
    ) {
      displayErrorMessage("*Please fill out all fields");
      return;
    }
    if (password.value !== confirmPass.value) {
      displayErrorMessage("*Password does not match");
      return;
    }
    setSignupStatus("Signing up...");
    fetch(notahApi, {
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
        setSignupStatus("Sign Up");
        console.log(data);
        if (data.status === 400) {
          displayErrorMessage("*Username already exists");
          return;
        }
        window.location.href = "/login";
      })
      .catch((e) => {
        setSignupStatus("Sign Up");
        console.error(e);
        displayErrorMessage("*Failed to create account");
      });
  };
  return (
    <>
      <div className="bg-gradient-to-br from-yellow-200 via-amber-600 to-red-600 bg-[length:400%_400%] min-h-[100vh] flex justify-center animate-gradient flext justify-content items-center">
        <div className="bg-white p-2 rounded-xl h-fit min-w-[400px]">
          <h2 className="mt-5 mb-5 text-center font-semibold text-2xl">
            Sign Up
          </h2>
          <p
            className="text-red-600 ml-5"
            style={{ display: display ? "block" : "none" }}
          >
            {errMsg}
          </p>
          <div className="grid grid-cols-1 gap-4 place-content-center ml-5 mr-5">
            <div className="grid grid-cols-1 content-start gap-1">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                placeholder="Type your username"
              />
              <hr />
            </div>
            <div className="grid grid-cols-1 content-start gap-1">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" placeholder="Type your email" />
              <hr />
            </div>
            <div className="grid grid-cols-1 content-start gap-1">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Type your password"
              />
              <hr />
            </div>
            <div className="grid grid-cols-1 content-start gap-1">
              <label htmlFor="confirm-password">Confirm Password</label>
              <input
                id="confirm-password"
                type="password"
                placeholder="Confirm your password"
              />
              <hr />
            </div>
            <button
              className="mt-3 rounded-lg p-2 font-medium hover:bg-amber-300 active:bg-amber-400 bg-amber-200 "
              onClick={() => createAccount()}
            >
              {signupStatus}
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
