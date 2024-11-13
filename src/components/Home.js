import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom'
import axios from 'axios';

import { useAuth } from '../contexts/AuthContext';
import Header from './Header';
import TicketPreviewFactory from './TicketPreviewFactory';

import '../styles/header.css';
import '../styles.css'

const delay = ms => new Promise(res => setTimeout(res, ms));

function Home() {
    const [tickets, setTickets] = useState([]);
    const [displayedTickets, setDisplayedTickets] = useState([]);
    const [openCount, setOpenCount] = useState(0);
    const [closedCount, setClosedCount] = useState(0);
    const [message, setMessage] = useState('');
    const [viewingOpenTickets, setViewOpenTickets] = useState(true);
    const navigate = useNavigate();
    const {auth, username} = useAuth();

    useEffect(() => {
      if (!auth.authenticated) {
        navigate('/login');
      }
    }, [auth, navigate]);

    const viewOpenTickets = () => {
      setViewOpenTickets(true);
      setDisplayedTickets(tickets.filter((ticket) => ticket.status == viewingOpenTickets));
    }

    const viewClosedTickets = () => {
      setViewOpenTickets(false);
      setDisplayedTickets(tickets.filter((ticket) => ticket.status == viewingOpenTickets));
    }

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
            setDisplayedTickets(tickets.filter((ticket) => ticket.status == viewingOpenTickets));

            if (viewingOpenTickets) {
              setClosedCount(tickets.length - displayedTickets.length);
              setOpenCount(displayedTickets.length);
            } else {
              setClosedCount(displayedTickets.length);
              setOpenCount(tickets.length - displayedTickets.length);
            }

            if (!displayedTickets.length) {
              setMessage("No tickets to display.");
            }
        } catch (err) {
          setMessage("Error fetching tickets.");
        }
      };

      fetchTickets();
      delay(500);
    }, [tickets, openCount, closedCount]);
    
    return (
        <div>
            <Header 
              openTickets={openCount}
              closedTickets={closedCount}
              viewingOpenTickets={viewingOpenTickets}
              viewOpenTickets={viewOpenTickets}
              viewClosedTickets={viewClosedTickets}/>

            <div className="ticket-list">
                {
                    displayedTickets.length ? (
                      displayedTickets.map(displayedTicket => TicketPreviewFactory(displayedTicket))
                    ) : (
                      <p id="home-message">{message}</p>
                    ) 
                }
            </div>
        </div>
    );
};

export default Home;