import React from 'react';

function Header() {
    return (
        <div className="header">
            <div className="navbar-element">
                <a href="/">Open Tickets</a>
            </div>
            <div className="navbar-element">
                <a href="/history">Closed Tickets</a>
            </div>
        </div>
    );
}

export default Header;