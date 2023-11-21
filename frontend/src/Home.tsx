import { HomeProps } from "./Props";
import Canvas from "./Canvas";
import Notes from "./Notes";
import Toolbar from "./Toolbar";

export default function Home({access} : HomeProps) {
  return (
    <div className="bg-amber-50">
      <Toolbar access={access} />
      <div className="flex h-full">
        <Notes access={access} />
        <Canvas access={access} />
      </div>
    </div>
  );
}
