import React, {useRef, useState} from 'react';
import '../styles/style.css';

const InputArea = (props) => {

    const [value, setValue] = useState("")
    const textareaRef = useRef(null);
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            return false;
        }
    };

    function HandleSend(){
        if (value !== "") {
            props.send_button(value, "right");
            setValue("")
        }

    }

    return (
        <div className="header_bottom" id="input">
            <textarea id="input_area" ref={textareaRef} onKeyDown={handleKeyDown} placeholder="Search Trending movies here..." value={value} onChange={event => setValue(event.target.value)}></textarea>
            <button className="send_button" type="submit" id="send" onClick={HandleSend}>Send</button>
        </div>
    );
};

document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        document.getElementById('send').click();
    }
});

export default InputArea;