import React, {useRef, useState, useEffect} from 'react';
import axios from 'axios';
import '../styles/manageusers.css';
import { useAuth } from '../contexts/AuthContext';

const ManageUsers = ({ users, closeModal }) => {
    const [message, setMessage] = useState('');
    const [updateSuccess, setUpdateSuccess] = useState(true);
    const popupRef = useRef(null);
    const {username} = useAuth();
  
    const [userRoles, setUserRoles] = useState(
        users.reduce((acc, user) => {
            acc[user.username] = user.level;
            return acc;
        }, {})
    );
  
    const handleRoleChange = (username, newRole) => {
        setUserRoles({
            ...userRoles,
            [username]: parseInt(newRole),
        });
    };
  
    const handleSave = () => {
        let update = {
            username: username,
            updates: userRoles
        }

        axios.post('http://localhost:5000/updateUserLevel', update).then((res) => {
            if (res.status == 200) {
                setUpdateSuccess(true)
                setMessage("Successfully updated users");
                
                for (const user of users) {
                    user.level = userRoles[user.username];
                }

            } else {
                setUpdateSuccess(false);
                setMessage("Error updating users");
            }
        });
    };

    useEffect(() => {
      const handleClickOutside = (event) => {
          if (popupRef.current && !popupRef.current.contains(event.target)) {
              closeModal();
          }
      };

      document.addEventListener('click', handleClickOutside);
      return () => {
          document.removeEventListener('click', handleClickOutside);
      };
    }, []);
  
    return (
      <div className="popup-overlay">
          <div className="popup-container" ref={popupRef}>
            <button className="close-btn" onClick={closeModal}>
                &times;
            </button>
            <div className="popup-header">
                <h2>Manage User Roles</h2>
            </div>
            <div className="user-list">
                {users.map((user) => (
                <div className="user-item" key={user.username}>
                    <span className="user-name">{user.username}</span>
                    <div className="role-dropdown">
                        <select disabled={user.level == 3} 
                            defaultValue={`${user.level}`}
                            onChange={(e) => handleRoleChange(user.username, e.target.value)}
                        >
                            <option value="1">user</option>
                            <option value="2">elevated</option>
                            <option value="3">admin</option>
                        </select>
                    </div>
                </div>
                ))}
            </div>
          <div className="popup-footer">
              <button className="save-btn" onClick={handleSave}>Save</button>
          </div>
          <p id="manage-users-err" className={updateSuccess ? 'success' : 'failure'}>{message}</p>
        </div>
      </div>
    );
}

export default ManageUsers;
