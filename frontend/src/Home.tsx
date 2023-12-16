import { HomeProps } from "./Props";
import Canvas from "./Canvas";
import Notes from "./Notes";
import Toolbar from "./Toolbar";

export default function Home({access} : HomeProps) {
  return (
    <div className="bg-amber-50">
      <Toolbar/>
      <div className="flex h-full">
        <Notes/>
        <Canvas access={access} />
      </div>
    </div>
  );
}
