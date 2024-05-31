import React from 'react';
import '../styles/style.css';
import Message from "./Message";

const RightMessage = (props) => {
    return (
        <div className="right_message">
            <div className="icon"></div>
            <div className="msg right">
                <Message message={props.right_message}/>
            </div>
        </div>
    );
};

export default RightMessage;