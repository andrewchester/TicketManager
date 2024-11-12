import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom'
import axios from 'axios';

import { useAuth } from '../contexts/AuthContext';
import Header from './Header';
import TicketPreviewFactory from './TicketPreviewFactory';

import '../styles/header.css';
import '../styles.css'

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function Home() {
    const [tickets, setTickets] = useState([]);
    const [openCount, setOpenCount] = useState(0);
    const [closedCount, setClosedCount] = useState(0);
    const [message, setMessage] = useState('');
    const [viewOpenTickets, setViewOpenTickets] = useState(true);
    const navigate = useNavigate();
    const {auth, username} = useAuth();

    useEffect(() => {
      if (!auth.authenticated) {
        navigate('/login');
      }
    }, [auth, navigate]);

    // fetch tickets from server
    // should be based on user ID
    // if the user can update / edit tickets then it should show open / unassigned tickets
    useEffect(() => {
      const fetchTickets = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/tickets`, {
              headers: {
                  username: username
              }
            });
            setTickets(response.data);
        
            let nclosed = 0;
            for (const ticket of tickets) {
              if (ticket.status == 'Closed') {
                nclosed++;
              }
            }

            setClosedCount(nclosed);
            setOpenCount(tickets.length - nclosed);

            if (!tickets.length) {
              setMessage("No tickets to display.");
            }
        } catch (err) {
          setMessage("Error fetching tickets.");
        }

      };

      fetchTickets();
      setTimeout(() => { }, 500);
    }, [tickets, openCount, closedCount]);
    
    return (
        <div>
            <Header openTickets={openCount} closedTickets={closedCount}/>

            <div className="ticket-list">
                {
                    tickets.length ? (
                      tickets.map(ticket => TicketPreviewFactory(ticket))
                    ) : (
                      <p id="home-message">{message}</p>
                    ) 
                }
            </div>
        </div>
    );
};

export default Home;