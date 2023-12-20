import Canvas from "./Canvas";
import Notes from "./Notes";
import Toolbar from "./Toolbar";

export default function Notah() {
  return (
    <div className="bg-amber-50 mobile:text-sm">
      <Toolbar/>
      <div className="flex h-full">
        <Notes/>
        <Canvas />
      </div>
    </div>
  );
}
