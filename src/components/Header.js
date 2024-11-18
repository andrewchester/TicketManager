import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import ticketicon from '../res/ticketicon.png';
import usericon from '../res/user.png';
import settingsicon from '../res/setting.png';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

import TicketCreator from './TicketCreator';
import AdminSettings from './ManageUsers';
import ManageUsers from './ManageUsers';

const Header = ({openTickets, closedTickets, viewingOpenTickets, viewOpenTickets, viewClosedTickets}) => {
    const [userInfoToggle, setUserInfoToggle] = useState(false);
    const [ticketFormVisible, setTicketFormVisible] = useState(false);
    const [settingsModalVisible, setSettingsModalVisible] = useState(false);
    const [users, setUsers] = useState([]);
    const {username, logout, level} = useAuth();
    const navigate = useNavigate();

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

    const openSettingsModal = (e) => {
        e.stopPropagation();
        setSettingsModalVisible(true);
    }

    const closeSettingsModal = (e) => {
        setSettingsModalVisible(false);
    }

    const onSave = (newUserRoles) => {
        setSettingsModalVisible(false);
    }

    // clicks outside of the dropdown
    const untoggleUserInfo = (e) => {
        if (!e.target.closest('.user-info-dropdown') && !e.target.closest('#navbar-user-logo')) {
            setUserInfoToggle(false);
        }
    };

    const handleLogout = (e) => {
        logout();
        navigate('/login');
    }

    React.useEffect(() => {
        document.addEventListener('click', untoggleUserInfo);

        if (level == 3) {
            try {
                axios.get('http://localhost:5000/users', {
                    params: {
                        username: username
                    }
                }).then((res) => {
                    setUsers(res.data);
                });
            } catch (err) {
                console.log(err);
            }
        }

        return () => {
            document.removeEventListener('click', untoggleUserInfo);
        };
    }, []);

    /*
        Icons from:
            https://www.flaticon.com/free-icons/settings
    */

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
                        <li onClick={handleLogout} className="logout-button">Logout</li>
                        </ul>
                    </div>
                )}

            </div>
            
            {level == 3 && 
                <div className="navbar-element">
                    <img className="navbar-logo"
                        id="navbar-setting-logo"
                        src={settingsicon}
                        alt="Settings Logo"
                        onClick={openSettingsModal} />
                </div>
            }


            {ticketFormVisible && <TicketCreator closeForm={closeTicketForm} />}
            {settingsModalVisible && <ManageUsers users={users} closeModal={closeSettingsModal}/>}
        </div>
    );
}

export default Header;