import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { userService } from './services/api';
import Dashboard from './components/Dashboard';
import UserList from './components/UserList';
import UserDetail from './components/UserDetail';
import { useTheme } from './context/ThemeContext';
import './App.css';

function Navigation() {
  const location = useLocation();
  const { darkMode, toggleTheme } = useTheme();
  
  const navItems = [
    { path: '/', label: '📊 Dashboard' },
    { path: '/users', label: '👥 Users' }
  ];

  return (
    <nav className={`nav ${darkMode ? 'nav-dark' : 'nav-light'}`}>
      <div className="nav-brand">
        <h2>📊 User Dashboard</h2>
      </div>
      <div className="nav-links">
        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
          >
            {item.label}
          </Link>
        ))}
        <button onClick={toggleTheme} className="theme-toggle">
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>
    </nav>
  );
}

function AppContent() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { darkMode } = useTheme();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const userData = await userService.getAllUsers();
        setUsers(userData);
        setError(null);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load user data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleUserUpdate = (updatedUser) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      )
    );
  };

  const handleUserCreate = (newUser) => {
    setUsers(prevUsers => [newUser, ...prevUsers]);
  };

  const handleUserDelete = (userId) => {
    setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
  };

  if (loading) {
    return (
      <div className={`app ${darkMode ? 'app-dark' : 'app-light'}`}>
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`app ${darkMode ? 'app-dark' : 'app-light'}`}>
        <div className="error-container">
          <h2>Oops! Something went wrong</h2>
          <p className="error">{error}</p>
          <button 
            className="btn btn-primary" 
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`app ${darkMode ? 'app-dark' : 'app-light'}`}>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={darkMode ? 'dark' : 'light'}
      />
      <Navigation />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard users={users} />} />
          <Route 
            path="/users" 
            element={
              <UserList 
                users={users} 
                onUserUpdate={handleUserUpdate}
                onUserCreate={handleUserCreate}
                onUserDelete={handleUserDelete}
              />
            } 
          />
          <Route 
            path="/users/:id" 
            element={
              <UserDetail 
                users={users}
                onUserUpdate={handleUserUpdate}
              />
            } 
          />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return <AppContent />;
}

export default App;