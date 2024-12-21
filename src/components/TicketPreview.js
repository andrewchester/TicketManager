import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import '../styles/ticket.css';

const TicketPreview = ({ title, description, owner, agent, status, created_at }) => {
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [ticketStatus, setTicketStatus] = useState(status); 
  const [errorMessage, setErrorMessage] = useState('');
  const [updateText, setUpdateText] = useState('');
  const [assignText, setAssignText] = useState('');
  const [updates, setUpdates] = useState([]);
  const {username, level} = useAuth();
  
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setErrorMessage('');
    setUpdateText('');
    setIsModalOpen(false);
  }
  const handleUpdateChange = (e) => setUpdateText(e.target.value);

  const handleUpdateSubmit = () => {
    try {
      if (updateText.length > 0 && updateText.length <= 100) {
        axios.post('http://localhost:5000/update', {username, title, updateText}).then((res) => {
          if (res.status == 200) {
            setUpdates([...updates, {text: updateText, author: username, created_at: new Date().toLocaleString()}]);
          }
        });
        setUpdateText(''); 
      } else {
        setErrorMessage('Update must be between 1 and 100 characters.');
      }
    } catch (err) {
        setErrorMessage("Failed to update ticket. Check if the ticket has an assigned agent.");
    }
  };

  const handleAssignToMe = async () => {
    try {
      const params = {
        assigner: username,
        assignee: username,
        title: title
      }
      const res = await axios.post('http://localhost:5000/assign', params);
    } catch (err) {
      setErrorMessage("Failed to assign ticket");
    }
  }

  const handleAssignToOther = async () => {
    try {
      const params = {
        assigner: username,
        assignee: assignText,
        title: title
      }
      const res = await axios.post('http://localhost:5000/assign', params);
    } catch (err) {
      setErrorMessage("Failed to assign ticket");
    }
  }

  const handleCloseTicket = async () => {
      try {
        if (ticketStatus) {
          const res = await axios.post('http://localhost:5000/close', {username, title});
        } else {
          const res = await axios.post('http://localhost:5000/reopen', {username, title});
        }

        setTicketStatus(!ticketStatus);
        closeModal();
      } catch (err) {
        setErrorMessage("Failed to close ticket.");
      }
      
  };

  useEffect(() => {
      console.log(agent);

      axios.get('http://localhost:5000/updates', {
        params: {
            username: username,
            title: title
        }
      }).then((res) => {
          if (res.status == 200)
              setUpdates(res.data);
      });
  }, []);

  const updateFactory = (update) => {
    return (
      <div key={update.created_at} className="ticket-update">
        <div className="update-time">{update.created_at}</div>
        <div className={`update-author`}>
          {update.author}
        </div>
        <div className="update-message">{update.text}</div>
      </div>
    )
  }

  const assignButton = () => {
    if (level == 2 && agent == null)
        return <button className="assign-button" onClick={handleAssignToMe}>Assign To Me</button>;  
    
    if (level == 3)
        return (
            <div className='admin-assign-element'>
                <textarea
                  className="assign-textarea"
                  value={assignText}
                  onChange={(e) => setAssignText(e.target.value)} 
                  placeholder={agent != undefined ? `${agent}` : "Assign to..."}
                  maxLength="25"
                />

              <button className="assign-button" onClick={handleAssignToOther}>
                  Assign
              </button>
            </div>
        );

    return <p className="user-tags"><strong>Agent:</strong> {agent ? agent : "Unassigned"}</p>;
  }
  
  return (
    <div>
      <div className="ticket-container" onClick={openModal}>
        <h3 className="ticket-title">{title}</h3>
        <p className="ticket-description">{description}</p>
        <p className={`ticket-status ${ticketStatus ? '' : 'closed'}`}>
          Status: {ticketStatus ? "Open" : "Closed"}
        </p>
        <p className="ticket-owner">
          Owner: {owner}
        </p>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-button" onClick={closeModal}>
                &times;
            </button>
            <h2 className="modal-title">{title}</h2>
            <div className="ticket-header">
              <div className="ticket-creator">
                <strong>Created by:</strong> {owner}
              </div>
              <div className="ticket-created-at">
                <strong>Created on:</strong> {created_at}
              </div>
            </div>

            <div className="ticket-description">
              <strong>Description:</strong>
              <p>{description}</p>
            </div>

            <div className="ticket-updates">
              {updates.length ? updates.map(update => updateFactory(update)) : <p></p>}
            </div>

            <div className="update-section">
              <textarea
                value={updateText}
                onChange={handleUpdateChange}
                placeholder="Add an update (max 100 characters)"
                maxLength="100"
              />
            </div>

            <p className="error-message">{errorMessage}</p>

            <div className="ticket-footer">
              <div className="ticket-status">
                <strong>Status:</strong> {ticketStatus ? "open" : "closed"}
              </div>
              <div className="assigned-agent">
                {assignButton()}
              </div>
            </div>
            <div className="button-container">
              <button className="update-ticket-button" onClick={handleUpdateSubmit}>Add Update</button>
              <button className={`close-ticket-button ${status ? "" : "reopen"}`} onClick={handleCloseTicket}>
                {status ? "Close Ticket" : "Reopen Ticket"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketPreview;