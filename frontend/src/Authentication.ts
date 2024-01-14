import API from "./API.json";

const apiLink = API["isDev"] ? API["API"]["dev"] : API["API"]["production"];

export default async function refreshToken() {
    try {
        const res = await fetch(apiLink + `Authentication/refreshToken`, {
            credentials: "include",
          });
        if (!res.ok) {
            window.location.href = "/login?status=timeout";
        } else {
            return true
        }
    } catch(e) {
        window.location.href = "/login?status=timeout";
    }
    
}