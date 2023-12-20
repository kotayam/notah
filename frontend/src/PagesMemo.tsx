export default function PagesMemo() {
  return (
    <>
      <div className="h-full overflow-scroll">
        <div>
          <ul>
            <li key={0} className="whitespace-nowrap p-1 text-amber-500 font-bold text-center">
              Pages
            </li>
            <li key={1}
              className="whitespace-nowrap p-1 bg-gray-300 border-t-2"
            >
              Memo
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
