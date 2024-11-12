import React, {useState} from 'react';
import '../styles/ticket.css';

const TicketPreview = ({ title, description, status }) => {
  const [isModalOpen, setIsModalOpen] = useState(false); 
 const [ticketStatus, setTicketStatus] = useState(status); 
  
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const handleUpdateChange = (e) => setUpdateText(e.target.value);

  const handleUpdateSubmit = () => {
    if (updateText.length > 0 && updateText.length <= 100) {
      setUpdateText(''); 
    } else {
      alert('Update must be between 1 and 100 characters.');
    }
  };

  const handleCloseTicket = () => {
    setTicketStatus('closed');
  };
  
  return (
    <div>
      <div className="ticket-container" onClick={openModal}>
        <h3 className="ticket-title">{title}</h3>
        <p className="ticket-description">{description}</p>
        <p className={`ticket-status ${ticketStatus === 'closed' ? 'closed' : ''}`}>
          Status: {ticketStatus}
        </p>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-button" onClick={closeModal}>
                &times;
            </button>
            <h2 className="modal-title">{title}</h2>
            <p className="modal-description">{description}</p>
            
            <div className="update-section">
              <textarea
                value={updateText}
                onChange={handleUpdateChange}
                placeholder="Add an update (max 100 characters)"
                maxLength="100"
              />
            </div>

            <div className="button-container">
              <button className="update-ticket-button" onClick={handleUpdateSubmit}>Add Update</button>
              <button className="close-ticket-button" onClick={handleCloseTicket}>
                Close Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketPreview;