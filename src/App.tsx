import React from 'react';

// Import the basic test component with inline styles
import BasicTest from './BasicTest';

const App: React.FC = () => {
  return (
    <div style={{ 
      backgroundColor: '#f3f4f6', 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      <BasicTest />
    </div>
  );
};

export default App;
