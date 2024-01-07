import { useSelector } from "react-redux";
import { rootState } from "./store";

export default function AccountInfo() {
  const account = useSelector((root: rootState) => root.account);
  return (
    <div className="p-2 grid grid-cols-1 gap-2 overflow-scroll">
      <div className="flex justify-start items-center gap-10">
        <div className="grid grid-cols-1 gap-2">
          <div>{`Username: ${account.username}`}</div>
          <div>{`Access: ${account.role.toUpperCase()}`}</div>
        </div>
        <div className="rounded-full bg-amber-500 w-10 h-10 mobile:w-8 mobile:h-8 flex justify-center items-center">
          <div className=" text-center text-2xl mobile:text-xl text-white">
            {account.username.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
      <div>{`Email: ${account.email}`}</div>
      <div>{`AI Usage Limit: ${account.aiUsageLimit}`}</div>
      <div>{`Date Joined: ${account.dateCreated}`}</div>
      <div>{`Last Edited: ${account.lastEdited}`}</div>
    </div>
  );
}
