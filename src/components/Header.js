import React, {useState} from 'react';
import ticketicon from '../res/ticketicon.png'
import usericon from '../res/user.png'
import { useAuth } from '../contexts/AuthContext';

import TicketCreator from './TicketCreator';

const Header = ({openTickets, closedTickets, viewingOpenTickets, viewOpenTickets, viewClosedTickets}) => {
    const [userInfoToggle, setUserInfoToggle] = useState(false);
    const [ticketFormVisible, setTicketFormVisible] = useState(false);
    const {username} = useAuth();

    const toggleUserInfo = () => {
        setUserInfoToggle(!userInfoToggle);
    };

    const openTicketForm = (e) => {
        e.stopPropagation();
        setTicketFormVisible(true);
    }

    const closeTicketForm = () => {
        setTicketFormVisible(false);
    }

    // clicks outside of the dropdown
    const untoggleUserInfo = (e) => {
        if (!e.target.closest('.user-info-dropdown') && !e.target.closest('#navbar-user-logo')) {
            setUserInfoToggle(false);
        }
    };

    React.useEffect(() => {
        document.addEventListener('click', untoggleUserInfo);
        return () => {
            document.removeEventListener('click', untoggleUserInfo);
        };
    }, []);

    return (
        <div className={userInfoToggle ? "header-user-info" : "header"}>
            <div className="navbar-element">
                <img className="navbar-logo" src={ticketicon} alt="Ticket Logo" />
            </div>
            <div className={`navbar-element ${viewingOpenTickets ? "selected" : "unselected"}`}>
                <a onClick={viewOpenTickets}>Open</a>
            </div>
            <div className={`navbar-element ${viewingOpenTickets ? "unselected" : "selected"}`}>
                <a onClick={viewClosedTickets}>Closed</a>
            </div>
            <div className="navbar-element">
                <p id="new-ticket" onClick={openTicketForm}>+</p>
            </div>
            <div className="navbar-element">
                <img className="navbar-logo" 
                     id="navbar-user-logo" 
                     src={usericon} 
                     alt="User Logo"
                     onClick={toggleUserInfo} />

                {userInfoToggle && (
                    <div className="user-info-dropdown">
                        <ul>
                        <li id='navbar-username'>{username}</li>
                        <li>{openTickets} Open</li>
                        <li>{closedTickets} Closed</li>
                        </ul>
                    </div>
                )}

            </div>


            {ticketFormVisible && <TicketCreator closeForm={closeTicketForm} />}
        </div>
    );
}

export default Header;