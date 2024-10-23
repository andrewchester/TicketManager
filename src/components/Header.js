import React from 'react';
import ticketicon from '../res/ticketicon.png'
import usericon from '../res/user.png'

function Header() {
    return (
        <div className="header">
            <div className="navbar-element">
                <img id="navbar-logo" src={ticketicon} alt="Ticket Logo" />
            </div>
            <div className="navbar-element">
                <a href="/">Open</a>
            </div>
            <div className="navbar-element">
                <a href="/history">Closed</a>
            </div>
            <div className="navbar-element">
                <p id="new-ticket">+</p>
            </div>
            <div className="navbar-element">
                <img id="navbar-logo" src={usericon} alt="User Logo" />
            </div>
        </div>
    );
}

export default Header;