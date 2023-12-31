import { useSelector } from "react-redux";
import { rootState } from "./store";

export default function AccountInfo() {
  const account = useSelector((root: rootState) => root.account);
  return (
    <div className="p-2 grid grid-cols-1">
      <div className="flex justify-between items-center">
        <div className="grid grid-cols-1">
          <div>{`Username: ${account.username}`}</div>
          <div>{`Access: ${account.role.toUpperCase()}`}</div>
        </div>
        <div className="rounded-full bg-amber-500 w-10 h-10 flex justify-center items-center">
          <div className="text-2xl text-white">
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
