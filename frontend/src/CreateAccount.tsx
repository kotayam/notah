import { useState } from "react";

const notahApi = "http://localhost:5245/api/v1/Accounts";

export default function CreateAccount() {
    const [display, setDisplay] = useState(false);
    const [errMsg, setErrMsg] = useState("");

    const createAccount = () => {
        const fullName = document.getElementById("full-name") as HTMLInputElement | null;
        const email = document.getElementById("email") as HTMLInputElement | null;
        const password = document.getElementById("password") as HTMLInputElement | null;
        if (!(fullName && email && password)) {
            setErrMsg("Failed to create account");
            setDisplay(true);
            return;
        }
        if (fullName.value && email.value && password.value) {
            fetch(notahApi, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },
                body: JSON.stringify({fullName: fullName.value, email: email.value, password: password.value})
            })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                window.location.href = "/login";
            })
            .catch(e => {
                console.error(e);
                setErrMsg("Failed to create account");
                setDisplay(true);
            })
        }
        else {
            setErrMsg("Please fill out all fields");
            setDisplay(true);
            return;
        }
    }
    return (
        <>
        <div className="bg-amber-50 w-1/2 m-auto">
            <div className="flex items-center">
                <p className="text-red-600" style={{display: display? "block" : "none"}}>{errMsg}</p>
                <label htmlFor="full-name">Full Name</label>
                <input className="border-2" id="full-name" type="text" placeholder="Full Name"/>
                <label htmlFor="email">Email</label>
                <input className="border-2" id="email" type="text" placeholder="Email" />
                <label htmlFor="password">Password</label>
                <input className="border-2" id="password" type="password" placeholder="Password"/>
            </div>
            <button className="border-2" onClick={() => createAccount()}>Create Account</button>
            <a href="/login">back to login</a>
        </div>
        </>
    )
}