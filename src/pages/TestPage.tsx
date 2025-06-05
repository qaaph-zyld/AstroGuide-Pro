import React from 'react';
import TestComponent from '../TestComponent';

const TestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <h1 className="text-3xl font-bold text-indigo-600 mb-6 text-center">
          AstroGuide Pro - Test Page
        </h1>
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <p className="text-gray-600 mb-4">
              This page is used to test that the application is rendering correctly and that all core functionality is working.
            </p>
            <TestComponent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
