import React, {useEffect, useState}from 'react';
import axios from 'axios';

import Header from './components/Header';
import TicketPreviewFactory from './components/TicketPreviewFactory';
import './styles/header.css';
import './styles.css'

function App() {
  const [tickets, setTickets] = useState([]);
  const [newTicket, setNewTicket] = useState({ user_id: '', agent_id: '', title: '', description: '' });

  // gets all tickets from DB in memory
  useEffect(() => {
    const fetchTickets = async () => {
      const response = await axios.get(`http://localhost:5000/tickets`);
      setTickets(response.data);
    };
    fetchTickets();
  }, []);

  // function to create ticket
  // agent_id exists but is not necessary
  const handleAddTicket = async () => {
    const response = await axios.post(`http://localhost:5000/tickets`, newTicket);
    setTickets([...tickets, response.data]);
    setNewTicket({ user_id: '', agent_id: '', title: '', description: '' }); // Reset form
  };

  return (
    <div>
      <Header />

      <div className="ticket-list">
          {tickets.map(ticket => TicketPreviewFactory(ticket))}
      </div>
    </div>
  );
};

export default App;