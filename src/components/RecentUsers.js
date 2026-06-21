import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import './RecentUsers.css';

const RecentUsers = ({ users }) => {
  if (!users || users.length === 0) {
    return (
      <div className="chart-container">
        <h3 className="chart-title">Recently Joined Users</h3>
        <p className="chart-subtitle">Latest user registrations</p>
        <div className="no-data">
          <p>No recent users to display</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <h3 className="chart-title">Recently Joined Users</h3>
      <p className="chart-subtitle">Latest user registrations</p>
      <div className="recent-users-list">
        {users.map((user, index) => (
          <Link
            key={user.id}
            to={`/users/${user.id}`}
            className="recent-user-item"
          >
            <div className="user-rank">#{index + 1}</div>
            <div className="user-avatar-container">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={`${user.name} avatar`}
                  className="user-avatar"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div 
                className="user-avatar-placeholder"
                style={{ display: user.avatar ? 'none' : 'flex' }}
              >
                {user.name ? user.name.charAt(0).toUpperCase() : '?'}
              </div>
            </div>
            <div className="user-info">
              <div className="user-name">{user.name || 'Unknown User'}</div>
              <div className="user-email">{user.email || 'No email'}</div>
              <div className="user-date">
                Joined {format(new Date(user.createdAt), 'MMM dd, yyyy')}
              </div>
            </div>
            <div className="user-arrow">View</div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecentUsers;