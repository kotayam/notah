export default function Pages() {
    return (
        <>
        <div className="h-full flex-1">
            <button className="hover:bg-gray-200 active:bg-gray-300 whitespace-nowrap border-b-2 p-1 w-full font-bold text-amber-500">
                + Add Page
            </button>
            <div className="">
                <ul>
                    <li className="hover:bg-gray-200 p-1">Page 1</li>
                    <li className="hover:bg-gray-200 p-1">Page 2</li>
                </ul>
            </div>
        </div>
        </>
        
    )
}