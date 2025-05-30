import React from 'react';

const BasicTest: React.FC = () => {
  return (
    <div style={{ 
      padding: '20px', 
      margin: '20px auto', 
      maxWidth: '500px', 
      backgroundColor: 'white', 
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ color: '#4f46e5', fontSize: '24px', marginBottom: '16px' }}>AstroGuide Pro Test</h1>
      <p style={{ color: '#374151', marginBottom: '16px' }}>This is a basic test component with inline styles.</p>
      <button style={{ 
        backgroundColor: '#4f46e5', 
        color: 'white', 
        padding: '8px 16px', 
        border: 'none', 
        borderRadius: '4px',
        cursor: 'pointer'
      }}>
        Test Button
      </button>
    </div>
  );
};

export default BasicTest;
