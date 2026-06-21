import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import './UserDetail.css';

const UserDetail = ({ users, onUserUpdate }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = users.find(u => u.id === id);

  if (!user) {
    return (
      <div className="user-detail-container">
        <div className="error-state">
          <h2>User Not Found</h2>
          <p>The user you're looking for doesn't exist or has been removed.</p>
          <button 
            onClick={() => navigate('/users')}
            className="btn btn-primary"
          >
            Back to Users
          </button>
        </div>
      </div>
    );
  }

  const handleEdit = () => {
    navigate(`/users/${id}/edit`);
  };

  const handleBack = () => {
    navigate('/users');
  };

  return (
    <div className="user-detail-container">
      <div className="user-detail-header">
        <button 
          onClick={handleBack}
          className="btn btn-secondary back-button"
        >
          ← Back to Users
        </button>
        <div className="header-actions">
          <button 
            onClick={handleEdit}
            className="btn btn-primary"
          >
            Edit User
          </button>
        </div>
      </div>

      <div className="user-detail-content">
        <div className="user-profile">
          <div className="user-avatar-section">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={`${user.name} avatar`}
                className="user-avatar-large"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div 
              className="user-avatar-placeholder-large"
              style={{ display: user.avatar ? 'none' : 'flex' }}
            >
              {user.name ? user.name.charAt(0).toUpperCase() : '?'}
            </div>
          </div>
          
          <div className="user-info">
            <h1 className="user-name-large">{user.name || 'Unknown User'}</h1>
            <p className="user-email-large">{user.email || 'No email provided'}</p>
            <div className="user-meta">
              <div className="meta-item">
                <span className="meta-label">User ID</span>
                <span className="meta-value">{user.id}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Joined</span>
                <span className="meta-value">
                  {format(new Date(user.createdAt), 'MMMM dd, yyyy')}
                </span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Member for</span>
                <span className="meta-value">
                  {Math.floor((new Date() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24))} days
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="user-details-grid">
          <div className="detail-card">
            <h3 className="card-title">Profile Information</h3>
            <div className="detail-list">
              <div className="detail-item">
                <span className="detail-label">Full Name</span>
                <span className="detail-value">{user.name || 'Not provided'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Email Address</span>
                <span className="detail-value">{user.email || 'Not provided'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Profile Picture</span>
                <span className="detail-value">
                  {user.avatar ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>

          <div className="detail-card">
            <h3 className="card-title">Account Details</h3>
            <div className="detail-list">
              <div className="detail-item">
                <span className="detail-label">User ID</span>
                <span className="detail-value code">{user.id}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Created At</span>
                <span className="detail-value">
                  {format(new Date(user.createdAt), 'MMM dd, yyyy HH:mm:ss')}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Account Status</span>
                <span className="detail-value status-active">Active</span>
              </div>
            </div>
          </div>

          <div className="detail-card">
            <h3 className="card-title">Activity Summary</h3>
            <div className="activity-stats">
              <div className="stat-item">
                <div className="stat-value">1</div>
                <div className="stat-label">Account Created</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">
                  {user.avatar ? '100%' : '0%'}
                </div>
                <div className="stat-label">Profile Complete</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">
                  {Math.floor((new Date() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24))}
                </div>
                <div className="stat-label">Days Active</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;