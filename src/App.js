import { useState } from "react"
import Header from "./Header"
import InputForm from "./InputForm"
import Summary from "./Summary"

function App() {
    const [JSONData, setJSONData] = useState([])
    const [AIResponse, setAIResponse] = useState("")

    return (
        <div className="App">
            <Header></Header>
            <InputForm setJSONData={setJSONData} setAIResponse={setAIResponse}></InputForm>
            <Summary JSONData={JSONData} AIResponse={AIResponse}></Summary>
        </div>
    );
}

export default App
