import "./InputForm.css"
import InputRow from "./InputRow"
import InputTitle from "./InputTitle"
import InputTextarea from "./InputTextarea"
import { useState } from "react"

function validInt(str) {
    if (typeof str != "string") return false
    return !isNaN(str) && !isNaN(parseInt(str))
}

function InputForm({ setJSONData }) {
    const [URL, setURL] = useState("")
    const [maxScrolls, setMaxScrolls] = useState("3")

    const handleURLChange = (e) => {
        setURL(e.target.value)
    }

    const handleMaxScrollsChange = (e) => {
        setMaxScrolls(e.target.value)
    }

    const requestLocation = async () => {
        if (URL.length == 0) {
            alert("URL cannot be empty!")
        }
        if (!validInt(maxScrolls) || parseInt(maxScrolls) <= 0) {
            alert("Max scrolls must be a positive integer!")
        }

        try {
            const response = await fetch("http://127.0.0.1:8000/api/scrape", {
                method: "POST",
                headers: {
                    "accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    url: URL,
                    max_scrolls: 2
                })
            })

            if (!response.ok) {
                const err = await response.json()
                throw new Error(err)
            }

            const data = await response.json()
            setJSONData(data)
            // console.log(data)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="input-form">
            <div className="input-form-header">Parameters</div>
            <InputRow 
                leftContent={<InputTitle title="Google Location URL"></InputTitle>}
                rightContent={
                    <InputTextarea 
                        placeholder="URL" 
                        value={URL} 
                        onChange={handleURLChange}>
                    </InputTextarea>}
            >
            </InputRow>
            <InputRow 
                leftContent={<InputTitle title="Max Scroll Attempts"></InputTitle>}
                rightContent={
                    <InputTextarea 
                        placeholder="Max Scrolls" 
                        value={maxScrolls} 
                        onChange={handleMaxScrollsChange}>
                    </InputTextarea>}
            >
            </InputRow>
            <button className="input-form-button" onClick={requestLocation}>Scrape Location</button>
        </div>
    )
}

export default InputForm
