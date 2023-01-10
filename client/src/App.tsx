import React from 'react';
import Register from './pages/Register';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home />
    },
    {
      path: '/register',
      element: <Register />
    },
    {
      path: '/login',
      element: <Login />
    }
  ]);

  return (
    <div className="flex">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
