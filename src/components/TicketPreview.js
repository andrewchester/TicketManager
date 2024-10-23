import React from 'react';

const TicketPreview = ({ title, description, status }) => {
  return (
    <div className="ticket">
      <h3>{title}</h3>
      <p>{description}</p>
      <p>Status: {status}</p>
    </div>
  );
};

export default TicketPreview;