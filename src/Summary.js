import React, { useEffect, useRef } from "react"
import "./Summary.css"
import { marked } from "marked"

marked.setOptions({
    breaks: true
})

function Summary({ JSONData, AIResponse="", filename="summary.json" }) {
    const aiResponseRef = useRef(null);
    
    useEffect(() => {
        if (aiResponseRef.current) {
            aiResponseRef.current.innerHTML = marked.parse(AIResponse);
        }
    }, [AIResponse])
    
    const DownloadJSON = () => {
        const JSONStr = typeof JSONData === "object" ? JSON.stringify(JSONData, null, 4) : JSONData;
        const blob = new Blob([JSONStr], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = filename

        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        // Clean up URL object
        URL.revokeObjectURL(url)
    }

    return (
        <div className="summary">
            <div className="summary-header">Summary</div>
            <div className="summary-body">
                <button onClick={DownloadJSON} className="summary-download-button">Download JSON</button>
                <div id="ai-response" ref={aiResponseRef}></div>
            </div>
        </div>
    )
}

export default Summary
