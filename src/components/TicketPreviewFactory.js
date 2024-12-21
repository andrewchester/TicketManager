import React from 'react';
import TicketPreview from './TicketPreview';

const TicketPreviewFactory = (ticketData) => {
  return (
    <TicketPreview  
      title={ticketData.title} 
      description={ticketData.description} 
      status={ticketData.status}
      owner={ticketData.owner}
      agent={ticketData.agent}
      created_at={ticketData.created_at} 
      key={ticketData.title}/>
  );
};

export default TicketPreviewFactory;