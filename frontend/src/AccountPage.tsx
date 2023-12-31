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
    id: string,
    username: string,
    email: string,
    dateCreated: string,
    aiUsageLimit: number,
    role: string
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
        window.location.href = "/login"
      });
  }, [account]);
  const returnMenu = () => {
    switch (selectedMenu) {
      case "Account":
        return <AccountInfo/>;
      case "Edit Account":
        return <AccountEdit/>;
      case "Delete Account":
        return <AccountDelete/>;
    }
  };

  return (
    <div className="bg-gradient-to-br from-yellow-200 via-amber-600 to-red-600 bg-[length:400%_400%] min-h-[100vh] flex justify-center items-center animate-gradient mobile:text-sm">
      <div className="bg-white rounded-xl py-2 h-fit min-w-[400px] flex justify-stretch items-start">
        <div className="grid grid-cols-1 place-content-center  border-r-2 h-full">
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
        
        {returnMenu()}
      </div>
    </div>
  );
}
