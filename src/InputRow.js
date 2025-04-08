import "./InputForm.css"

import { useState, useEffect } from 'react'

function InputRow({ 
    leftContent,
    rightContent,
    className = ""
}) {
    // TODO
    // const [fieldInput] = useState("")

    return (
        <div className={`input-row ${className}`}>
            <div className="input-left-div">
                {leftContent}
            </div>
            <div className="input-right-div">
                {rightContent}
            </div>
        </div>
    )
}

export default InputRow
