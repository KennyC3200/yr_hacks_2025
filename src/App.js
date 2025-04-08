import { useState } from "react"
import Header from "./Header"
import InputForm from "./InputForm"
import Summary from "./Summary"

function App() {
    const [JSONData, setJSONData] = useState([]);
    console.log(JSONData)

    return (
        <div className="App">
            <Header></Header>
            <InputForm setJSONData={setJSONData}></InputForm>
            <Summary JSONData={JSONData}></Summary>
        </div>
    );
}

export default App
