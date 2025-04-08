import "./InputForm.css"
import InputRow from "./InputRow"
import InputTitle from "./InputTitle"
import InputTextarea from "./InputTextarea"
import { useState } from "react"

function InputForm({ setJSONData }) {
    const [URL, setURL] = useState("");

    const handleURLChange = (e) => {
        setURL(e.target.value)
    }

    const requestLocation = async () => {
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
            <button className="input-form-button" onClick={requestLocation}>Scrape Location</button>
        </div>
    )
}

export default InputForm
