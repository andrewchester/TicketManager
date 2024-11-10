import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom'
import axios from 'axios';

import { useAuth } from '../contexts/AuthContext';
import Header from './Header';
import TicketPreviewFactory from './TicketPreviewFactory';

import '../styles/header.css';
import '../styles.css'

function Home() {
    const [tickets, setTickets] = useState([]);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const {auth} = useAuth();

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
            const response = await axios.get(`http://localhost:5000/tickets`);
            setTickets(response.data);

            if (!tickets.length) {
              setMessage("No tickets to display.");
            }
        } catch (err) {
          setMessage("Error fetching tickets.");
        }
      };
      fetchTickets();
    }, []);
    
    return (
        <div>
            <Header openTickets={tickets.length} closedTickets={tickets.length}/>

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