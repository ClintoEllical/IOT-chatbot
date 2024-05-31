import React from 'react';
import '../styles/style.css';

const Message = (props) => {
    return (
            <div className="message">
                <div className="mes_info">
                    <div className="mes_header">{props.message.name}</div>
                    <div className="mes_time">{props.message.date}</div>
                </div>
                <div className="mes_text">{props.message.info}</div>
            </div>
    );
};

export default Message;