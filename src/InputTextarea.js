import "./InputForm.css"

function InputTextarea({ placeholder, value, onChange }) {
    return (
        <div className="input-textarea-div">
            <textarea 
                className="input-textarea" 
                spellCheck={false} 
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            ></textarea>
        </div>
    )
}

export default InputTextarea
