import React from 'react';

const Loader = () => {
  return (
    <div className="flex items-center justify-center bg-slate-900 min-h-screen">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-blue-800 to-gray-200 animate-spin">
        <div className="h-7 w-7 rounded-full bg-slate-900"></div>
      </div>
    </div>
  );
};

export default Loader;
