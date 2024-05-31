import React from 'react';
import "../styles/style.css";


function addText(text_for_sidebar) {
    const area = document.getElementById("text");
    area.innerText = text_for_sidebar;
}

const Sidebar = (props) => {


    return (
        <div id="sidebar">
            <ul>
                <li>
                    <button className="bar" id="home">Home</button>
                </li>
                <li>
                    <button className="bar"
                            onClick={() => addText("Welcome to the movie bot page. " +
                                "This bot is designed to help you book a appoinment in muchen city hospital. Contributors:" +
                                " clinto, adarsh, thomas, seethal")}>About
                        us
                    </button>
                </li>
                <li>
                    <button className="bar" onClick={() => addText('you can add your emails here:\n' +
         'clinto: \nadarsh: \nthomas: \nseethal: seethal123@gmail.com')}>Contact
                    </button>
                </li>
                <button className="bar" id="dark_theme" onClick={props.func}>Change Mode</button>
            </ul>
            <p id="text">Welcome to the movie bot page.
                This bot is designed to help you book a appoinment in munchen hopital.
                Contributors: Clinto Adarsh Thomas Seethal</p>
        </div>
    );
};

export default Sidebar;