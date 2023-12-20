import NoteBooksMemo from "./NoteBooksMemo";
import PagesMemo from "./PagesMemo";

export default function NotesMemo() {
  return (
    <>
      <div className="border-r-2 max-w-[25%] mobile:max-w-[40%] bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 flex justify-start">
        <NoteBooksMemo />
        <PagesMemo />
      </div>
    </>
  );
}
