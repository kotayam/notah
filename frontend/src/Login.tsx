import { useDispatch } from "react-redux";
import { actionCreators } from "./store";
import { bindActionCreators } from "@reduxjs/toolkit";
import { redirect } from "react-router-dom";

const notahApi = "http://localhost:5245/api/v1/Login";

type Account = {
    id: string;
    fullName: string;
    email: string;
    password: string;
}

export default function Login() {
    const dispatch = useDispatch();
    const { setAccount } = bindActionCreators(actionCreators, dispatch);

    const login = () => {
        const email = document.getElementById("email") as HTMLInputElement | null;
        const password = document.getElementById("password") as HTMLInputElement | null;
        if (!(email && password)) {
            return;
        }
        if (email.value && password.value) {
            fetch(notahApi, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },
                body: JSON.stringify({email: email.value, password: password.value})
            })
            .then(res => res.json())
            .then(data => data as Account)
            .then(data => {
                console.log(data);
                setAccount({id: data.id, fullName: data.fullName})
                window.location.href = `/${data.id}`;
            })
            .catch(e => {
                console.log("failed to login");
                console.error(e);
            })
        }
        else {
            console.log("Please fill out all fields");
            return;
        }
    }
    return(
        <>
        <div className="bg-amber-50 w-1/2 m-auto">
            <div className="flex items-center">
                <label htmlFor="email">Email</label>
                <input className="border-2" id="email" type="text" placeholder="Email" />
                <label htmlFor="password">Password</label>
                <input className="border-2" id="password" type="password" placeholder="Password"/>
            </div>
            <button className="border-2" onClick={() => login()}>Login</button>
            <a className="border-2" href="/create-account">Create Account</a>
            <a className="border-2" href="/">return to home</a>
        </div>
        </>
        
    )
}