import AccountInfo from "./AccountInfo";
import AccountDelete from "./AccountDelete";
import AccountEdit from "./AccountEdit";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { rootState } from "./store";
import API from "./API.json";

const apiLink = API["isDev"] ? API["API"]["dev"] : API["API"]["production"];

const menu = ["Account", "Edit Account", "Delete Account"];

type AccountInfo = {
  id: string;
  username: string;
  email: string;
  dateCreated: string;
  aiUsageLimit: number;
  role: string;
};

export default function AccountPage() {
  const account = useSelector((root: rootState) => root.account);
  const [selectedMenu, setSelectedMenu] = useState(menu[0]);

  useEffect(() => {
    fetch(apiLink + `Accounts/${account.id}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.status === 404) throw new Error("404 page not found");
      })
      .catch((e) => {
        console.error(e);
        window.location.href = "/login";
      });
  }, [account]);
  const returnMenu = () => {
    switch (selectedMenu) {
      case "Account":
        return <AccountInfo />;
      case "Edit Account":
        return <AccountEdit />;
      case "Delete Account":
        return <AccountDelete />;
    }
  };

  return (
    <div className="bg-gradient-to-br from-yellow-200 via-amber-600 to-red-600 bg-[length:400%_400%] min-h-[100vh] flex justify-center items-center animate-gradient mobile:text-sm">
      <div className="bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 rounded-xl">
        <div className="bg-gradient-to-br from-amber-400 via-amber-300 to-amber-400 rounded-t-xl p-1 px-2">
          <a href="/notah">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 mobile:w-5 hover:bg-amber-200 active:bg-amber-100"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
              />
            </svg>
          </a>
        </div>
        <div className="h-[500px] flex justify-start items-start">
          <div className="grid grid-cols-1 place-content-start border-r-2 h-full overflow-scroll">
            {menu.map((m, idx) => {
              let bgColor = "";
              if (m === selectedMenu) bgColor = "bg-gray-200";
              let textColor = "";
              if (m === "Delete Account") textColor = "text-red-500";
              return (
                <button
                  key={idx}
                  className={`p-2 text-left hover:bg-gray-200 active:bg-gray-300 ${bgColor} ${textColor}`}
                  onClick={() => setSelectedMenu(m)}
                >
                  {m}
                </button>
              );
            })}
          </div>
          <div className="w-[400px] mobile:w-[250px]">{returnMenu()}</div>
        </div>
      </div>
    </div>
  );
}
