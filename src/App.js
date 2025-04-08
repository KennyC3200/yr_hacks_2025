import logo from "./logo.svg"
import "./App.css"

function App() {
    const sendURL = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/scrape", {
                method: "POST",
                headers: {
                    "accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    url: "https://www.google.com/maps/place/Harvey's/@43.8955846,-79.443642,17z/data=!3m1!4b1!4m6!3m5!1s0x882b2a6bed191d91:0x4560094eb1e60b57!8m2!3d43.8955846!4d-79.443642!16s%2Fg%2F11b6gf67sk?entry=ttu&g_ep=EgoyMDI0MTIxMS4wIKXMDSoASAFQAw%3D%3D"
                })
            })

            if (!response.ok) {
                const err = await response.json()
                throw new Error(err)
            }

            const data = await response.json()
            console.log(data)
        } catch (error) {
            console.log(error)
        } finally {
            console.log("SUCCESS")
        }
    }

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    Edit <code>src/App.js</code> and save to reload.
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
                <button onClick={sendURL}>
                    CLICK ME!
                </button>
            </header>
        </div>
    );
}

export default App;
