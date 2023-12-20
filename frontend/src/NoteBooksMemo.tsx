export default function NoteBooksMemo() {
  return (
    <>
      <div className="h-full border-r-2 overflow-scroll">
        <div>
          <ul>
            <li key={0} className="whitespace-nowrap p-1 text-amber-500 font-bold text-center">
              Notebooks
            </li>
            <li key={1} className="whitespace-nowrap p-1 bg-gray-300 border-t-2">
              Quick Notes
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
