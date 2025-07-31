import React from 'react';
import Calculator from './components/Calculator';

function App() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '2rem', maxWidth: '1000px', margin: 'auto' }}>
      <h1>High Flight Financial - Rent vs Buy Calculator</h1>
      <Calculator />
      <footer style={{ marginTop: '3rem', fontSize: '0.9rem', color: '#777' }}>
        highflightfinancial.biz
      </footer>
    </div>
  );
}

export default App;