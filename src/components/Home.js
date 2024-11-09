import React, {useEffect, useState} from 'react';
import {Route, Navigate, useNavigate} from 'react-router-dom'
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

import Header from './Header';
import TicketPreviewFactory from './TicketPreviewFactory';

import '../styles/header.css';
import '../styles.css'

function Home() {
    const [tickets, setTickets] = useState([]);
    const [newTicket, setNewTicket] = useState({ user_id: '', agent_id: '', title: '', description: '' });
    const { auth, logout } = useAuth();
    const navigate = useNavigate();

    // fetch tickets from server
    // should be based on user ID
    // if the user can update / edit tickets then it should show open / unassigned tickets
    useEffect(() => {
      const fetchTickets = async () => {
        //const response = await axios.get(`http://localhost:5000/tickets`);
        const response = {data: []};
        setTickets(response.data);
      };
      fetchTickets();
    }, []);

    if (!auth.authenticated) 
      navigate('/');

    return (
        <div>
          <Header openTickets={tickets.length} closedTickets={tickets.length}/>

          <div className="ticket-list">
            {
              tickets.length ? (
                tickets.map(ticket => TicketPreviewFactory(ticket))
              ) : (
                <p id="no-tickets">No tickets available.</p>
              ) 
            }
          </div>
        </div>
    );
};

export default Home;