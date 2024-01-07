import { useDispatch } from "react-redux";
import { actionCreators } from "./store";
import { bindActionCreators } from "@reduxjs/toolkit";
import { useEffect } from "react";

export default function Landing() {
  const dispatch = useDispatch();
  const { resetState } = bindActionCreators(actionCreators, dispatch);

  useEffect(() => {
    resetState();
  }, []);

  return (
    <div className="bg-gradient-to-br from-yellow-300 via-amber-600 to-red-600 bg-[length:400%_400%] min-h-[100vh] animate-gradient flex justify-center items-center p-2">
      <div className="grid grid-cols-1 gap-8 place-content-center">
        <div className="animate-slidein">
          <h1 className="text-5xl mobile:text-3xl font-bold text-white text-center">
            Welcome to Notah
          </h1>
          <h2 className="text-2xl mobile:text-lg text-white text-center">
            An AI-powered quick note-taking app
          </h2>
        </div>
        <div className="grid grid-cols-3 gap-4 place-content-center text-center text-white text-xl mobile:text-sm animate-slideup">
          <a href="/memo">
            <div className="hover:border-2 rounded-xl p-2">
              <div className="flex justify-center items-center gap-1 mb-2">
                <h3 className="text-2xl mobile:text-lg font-semibold">
                  Memo
                </h3>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="w-6 mobile:w-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
                  />
                </svg>
              </div>
              <p>
                Want to jot down a quick note?
                <br />
                Try out Notah without any registration!
              </p>
            </div>
          </a>
          <a href="/login">
            <div className="hover:border-2 rounded-xl p-2">
              <div className="flex justify-center items-center gap-1 mb-2">
                <h3 className="text-2xl mobile:text-lg font-semibold">
                  Login
                </h3>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="w-6 mobile:w-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
                  />
                </svg>
              </div>
              <p>
                Already have an account?
                <br />
                Login to get started!
              </p>
            </div>
          </a>
          <a href="/signup">
            <div className="hover:border-2 rounded-xl p-2">
              <div className="flex justify-center items-center gap-1 mb-2">
                <h3 className="text-2xl mobile:text-lg font-semibold">
                  Sign Up
                </h3>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="w-6 mobile:w-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
                  />
                </svg>
              </div>
              <p>
                Want full access to all features?
                <br />
                Sign up to create your notebooks!
              </p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
