import React from 'react';
import Message from "./Message";
import '../styles/style.css';

const LeftMessage = (props) => {
    return (
        <div className="left_message">
            <div className="icon left"></div>
            <div className="msg left">
                <Message message={props.left_message}/>
            </div>
        </div>
    );
};

export default LeftMessage;