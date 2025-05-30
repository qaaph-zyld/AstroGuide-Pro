import React from 'react';

const TestComponent: React.FC = () => {
  return (
    <div className="p-8 max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl m-4">
      <div className="md:flex">
        <div className="p-8">
          <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">Test Component</div>
          <p className="mt-2 text-gray-500">This is a test component to verify React rendering is working properly.</p>
          <button className="mt-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Test Button
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestComponent;
