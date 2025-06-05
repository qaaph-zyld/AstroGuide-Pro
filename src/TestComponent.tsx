import React, { useState, useEffect } from 'react';

interface SystemInfo {
  reactVersion: string;
  nodeEnv: string;
  browserInfo: string;
}

const TestComponent: React.FC = () => {
  const [systemInfo, setSystemInfo] = useState({
    reactVersion: React.version,
    nodeEnv: process.env.NODE_ENV || 'unknown',
    browserInfo: navigator.userAgent
  });

  const [testState, setTestState] = useState('Initial state');
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    // Test effect execution
    console.log('TestComponent mounted');
    
    try {
      // Test localStorage
      localStorage.setItem('test-item', 'test-value');
      const testValue = localStorage.getItem('test-item');
      
      if (testValue === 'test-value') {
        console.log('LocalStorage working correctly');
      } else {
        setErrorMessage('LocalStorage test failed');
      }
    } catch (error) {
      console.error('LocalStorage error:', error);
      setErrorMessage(`LocalStorage error: ${error instanceof Error ? error.message : String(error)}`);
    }

    return () => {
      console.log('TestComponent unmounted');
    };
  }, []);

  const handleTestClick = () => {
    try {
      setTestState(`Button clicked at ${new Date().toISOString()}`);
      console.log('Test button clicked');
    } catch (error) {
      console.error('Button click error:', error);
      setErrorMessage(`Button click error: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      margin: '20px auto', 
      maxWidth: '600px', 
      backgroundColor: 'white', 
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ color: '#4f46e5', fontSize: '24px', marginBottom: '16px' }}>AstroGuide Pro - Diagnostic Test</h1>
      
      <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f3f4f6', borderRadius: '4px' }}>
        <h2 style={{ fontSize: '18px', marginBottom: '8px' }}>System Information</h2>
        <p><strong>React Version:</strong> {systemInfo.reactVersion}</p>
        <p><strong>Node Environment:</strong> {systemInfo.nodeEnv}</p>
        <p><strong>Browser:</strong> {systemInfo.browserInfo}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '18px', marginBottom: '8px' }}>Component State</h2>
        <p><strong>State:</strong> {testState}</p>
      </div>

      {errorMessage && (
        <div style={{ 
          marginBottom: '20px', 
          padding: '10px', 
          backgroundColor: '#fee2e2', 
          color: '#b91c1c',
          borderRadius: '4px' 
        }}>
          <h2 style={{ fontSize: '18px', marginBottom: '8px' }}>Error</h2>
          <p>{errorMessage}</p>
        </div>
      )}

      <button 
        onClick={handleTestClick}
        style={{ 
          backgroundColor: '#4f46e5', 
          color: 'white', 
          padding: '8px 16px', 
          border: 'none', 
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Test Interactivity
      </button>
    </div>
  );
};

export default TestComponent;
