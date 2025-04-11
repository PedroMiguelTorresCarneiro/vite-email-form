import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function App() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/submit-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    setMsg(data.message);
    setEmail('');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Test</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Insere o teu email"
          style={{ marginRight: '1rem', padding: '0.5rem' }}
        />
        <button type="submit">Enviar</button>
      </form>
      <p>{msg}</p>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
