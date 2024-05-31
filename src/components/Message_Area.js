import React, {useEffect, useRef} from 'react';
import LeftMessage from "./Left_message";
import RightMessage from "./Right_message";
import '../styles/style.css';

const MessageArea = (props) => {

    const End = useRef(null)

    useEffect(() => {
        if(props.messages.length > 0) {
            scrollToBottom();
        }
        })

    function scrollToBottom() {
        End.current.scrollIntoView({behavior: "smooth"})
    }

    return (
        <div className={props.area}>
            {props.messages.map(mes => {
                switch (mes.type) {
                    case "right":
                        return <RightMessage right_message={mes}/>;
                    case "left":
                        return <LeftMessage left_message={mes}/>;
                }
            })}
            <div ref={End}></div>
        </div>
    );
};

export default MessageArea;