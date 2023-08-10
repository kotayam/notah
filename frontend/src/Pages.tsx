export default function Pages() {
    return (
        <>
        <div className="h-full flex-1">
            <button className="hover:bg-gray-200 active:bg-gray-300 whitespace-nowrap border-b-2 p-1 w-full">
                + Add Page
            </button>
            <div className="p-1">
                <ul>
                    <li>Page 1</li>
                    <li>Page 2</li>
                </ul>
            </div>
        </div>
        </>
        
    )
}