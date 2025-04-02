import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [theme, setTheme] = useState('dark'); // "dark" or "light"
  const [loading, setLoading] = useState(true);
  const [inviteCode, setInviteCode] = useState('');
  const [event, setEvent] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  // Simulate loading delay
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleInviteSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/invite', {
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

  // Generate multiple random dots
  const renderRandomDots = () => {
    const dotCount = 10;
    return Array.from({ length: dotCount }).map((_, index) => {
      const top = Math.random() * 100 + '%';
      const left = Math.random() * 100 + '%';
      const delay = Math.random() * 5;
      return (
        <div
          key={index}
          className="random-dot"
          style={{ top, left, animationDelay: `${delay}s` }}
        ></div>
      );
    });
  };

  if (loading) {
    return (
      <div className={`container ${theme}-theme`}>
        {renderRandomDots()}
        <div className="spinner"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className={`container ${theme}-theme`}>
        {renderRandomDots()}
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === 'dark' ? '☀' : '☾'}
        </button>
        <h2 className="invite-text">
          Please Enter Your Invite Code
          <span className="blinking-underscore">_</span>
        </h2>
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
    <div className={`container ${theme}-theme`}>
      {renderRandomDots()}
      <button className="theme-toggle" onClick={toggleTheme}>
        {theme === 'dark' ? '☀' : '☾'}
      </button>
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
