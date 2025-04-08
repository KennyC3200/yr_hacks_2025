import "./InputForm.css"
import InputRow from "./InputRow"
import InputTitle from "./InputTitle"
import InputTextarea from "./InputTextarea"
import { useState } from "react"

function validInt(str) {
    if (typeof str != "string") return false
    return !isNaN(str) && !isNaN(parseInt(str))
}

function animateToWidth(progressBar, targetWidth, msg) {
    let width = parseInt(progressBar.style.width)
    let id = setInterval(() => {
        if (width >= targetWidth) {
            clearInterval(id)
            progressBar.innerText = msg
        } else {
            width++
            progressBar.style.width = width + "%"
        }
    }, 20)
}

function InputForm({ setJSONData, setAIResponse }) {
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
            return
        }
        if (!validInt(maxScrolls) || parseInt(maxScrolls) <= 0) {
            alert("Max scrolls must be a positive integer!")
            return
        }

        let progressBar = document.getElementById("progress-bar")
        progressBar.style.width = "0%"
        progressBar.style.background = "#AFE1AF"
        progressBar.style.color = "black"
        progressBar.innerText = "Navigating..."
        animateToWidth(progressBar, 10, "Scraping Reviews")

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

            animateToWidth(progressBar, 30, "AI Processing...")
            const _response = await fetch("http://127.0.0.1:8000/api/ai", {
                method: "POST",
                headers: {
                    "accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({json: JSON.stringify(data)})
            })

            if (!_response.ok) {
                const err = await _response.json()
                throw new Error(err)
            }

            const aiResponse = await _response.text()
            console.log(aiResponse)
            setAIResponse(aiResponse)
            animateToWidth(progressBar, 50, "Finished Scraping Reviews")
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
            <div id="progress-bar">Start Scraping!</div>
        </div>
    )
}

export default InputForm
