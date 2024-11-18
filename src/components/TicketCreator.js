import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {useAuth} from '../contexts/AuthContext'
import '../styles/ticketform.css';

const TicketCreator = ({closeForm}) => {
    const {username} = useAuth();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const {auth} = useAuth();

    const popupRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                closeForm();
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const ticket = {
            "username": username,
            "title": title,
            "description": description,
        };

        try {
            const response = await axios.post('http://localhost:5000/ticket', ticket);
      
            setTitle('');
            setDescription('');
        } catch (err) {
            console.error('Error:', err);
        } finally {
            setSubmitting(false);
            closeForm();
        }
    };

    return (
        <div className="popup-overlay">
            <div className="popup" ref={popupRef}>
                <button className="close-btn" onClick={closeForm}>
                &times;
                </button>
                <h2>New Ticket</h2>
                <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">Title</label>
                    <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="Enter the title"
                    />
                </div>

                <div>
                    <label htmlFor="description">Description</label>
                    <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    placeholder="Describe the issue"
                    ></textarea>
                </div>

                <button type="submit" disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Create Ticket'}
                </button>
                </form>
            </div>
        </div>
    );
};

export default TicketCreator;
