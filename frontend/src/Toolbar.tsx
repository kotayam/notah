import "./App.css";

export default function Toolbar() {
    return (
        <>
        <div className="flex place-content-center">
            <form action="">
                <input type="radio" id="text"/>
                <label htmlFor="text">Text</label>
                <input type="radio" id="table"/>
                <label htmlFor="table">Table</label>
                <input type="radio" id="draw"/>
                <label htmlFor="draw">Draw</label>
                <input type="radio" id="shape" />
                <label htmlFor="shape">Shape</label>
            </form>
        </div>
        </>
    )
}