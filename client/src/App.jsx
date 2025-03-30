// src/App.js
import React, { useState } from 'react';
import './App.css';

function App() {
  const [inviteCode, setInviteCode] = useState('');
  const [event, setEvent] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleInviteSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inviteCode }),
      });
      const data = await response.json();
      if (response.ok) {
        setEvent(data.event);
        setMessage('');
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Server error');
    }
  };

  const handleReserveSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/reserve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: event.id,
          firstName,
          lastName,
          email,
        }),
      });
      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      console.error('Error:', error);
      setMessage('Server error');
    }
  };

  if (!event) {
    return (
      <div className="container">
        <h2>Please enter your invite code</h2>
        <form onSubmit={handleInviteSubmit}>
          <input
            type="text"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            placeholder="Invite Code"
            required
          />
          <button type="submit">Submit</button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    );
  }

  return (
    <div className="container">
      <h2>{event.name}</h2>
      <img src={event.poster_image} alt="Event Poster" className="poster" />
      <p>{event.description}</p>
      {!event.reserve ? (
        <button onClick={() => setEvent({ ...event, reserve: true })}>
          Reserve
        </button>
      ) : (
        <form onSubmit={handleReserveSubmit} className="reservation-form">
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
            required
          />
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
            required
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <button type="submit">Submit Reservation</button>
        </form>
      )}
      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default App;
