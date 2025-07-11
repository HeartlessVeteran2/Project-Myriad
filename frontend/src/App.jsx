import React from 'react';
import { features } from './features';

export default function App() {
  return (
    <div style={{ padding: 32 }}>
      <h1>Project Myriad</h1>
      <h2>Features</h2>
      <ul>
        {features.map(f => <li key={f}>{f}</li>)}
      </ul>
      <p>All features are being scaffolded and improved!</p>
    </div>
  );
}
