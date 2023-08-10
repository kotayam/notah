export default function NoteBooks() {
    return (
        <>
        <div className="h-full flex-1 border-r-2">
            <button className="hover:bg-gray-200 active:bg-gray-300 whitespace-nowrap border-b-2 p-1 w-full">
                + Add Notebook
            </button>
            <div className="p-1">
                <ul>
                    <li>Notebook 1</li>
                    <li>Notebook 2</li>
                </ul>
            </div>
        </div>
        </>
    )
}