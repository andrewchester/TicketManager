import React from 'react';
import TicketPreview from './TicketPreview';

const TicketPreviewFactory = (ticketData) => {
  return (
    <TicketPreview  
      title={ticketData.title} 
      description={ticketData.description} 
      status={ticketData.status} 
    />
  );
};

export default TicketPreviewFactory;