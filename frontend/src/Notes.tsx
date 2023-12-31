import NoteBooks from "./NoteBooks";
import Pages from "./Pages";

export default function Notes() {
  return (
    <>
      <div className="border-r-2 max-w-[25%] bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 flex justify-stretch mobile:grid mobile:grid-cols-2">
        <NoteBooks />
        <Pages />
      </div>
    </>
  );
}
