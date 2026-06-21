import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { userService } from '../services/api';
import './UserModal.css';

const UserModal = ({ user, mode, onClose, onSave, onDelete, onRequestEdit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Viewer',
    avatar: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user && mode !== 'create') {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'Viewer',
        avatar: user.avatar || ''
      });
    } else {
      setFormData({
        name: '',
        email: '',
        role: 'Viewer',
        avatar: ''
      });
    }
    setErrors({});
  }, [user, mode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (formData.avatar && !isValidUrl(formData.avatar)) {
      newErrors.avatar = 'Please enter a valid URL';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const userData = {
        ...formData,
        createdAt: user?.createdAt || new Date().toISOString()
      };

      if (mode === 'create') {
        const newUser = await userService.createUser(userData);
        onSave(newUser);
        toast.success('✅ User created successfully!');
      } else {
        const updatedUser = await userService.updateUser(user.id, userData);
        onSave(updatedUser);
        toast.success('✅ User updated successfully!');
      }
    } catch (error) {
      console.error('Error saving user:', error);
      setErrors({ submit: 'Failed to save user. Please try again.' });
      toast.error('❌ Failed to save user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (mode === 'view' || mode === 'edit') {
      if (!window.confirm('Are you sure you want to delete this user?')) {
        return;
      }
      setLoading(true);
      try {
        await userService.deleteUser(user.id);
        onDelete(user.id);
        toast.success('🗑️ User deleted successfully!');
      } catch (error) {
        console.error('Error deleting user:', error);
        setErrors({ submit: 'Failed to delete user. Please try again.' });
        toast.error('❌ Failed to delete user. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'create': return 'Create New User';
      case 'edit': return 'Edit User';
      case 'view': return 'User Details';
      default: return 'User';
    }
  };

  const isReadOnly = mode === 'view';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{getTitle()}</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="avatar-section">
            <div className="avatar-preview">
              {formData.avatar ? (
                <img
                  src={formData.avatar}
                  alt="User avatar"
                  className="avatar-image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div 
                className="avatar-placeholder"
                style={{ display: formData.avatar ? 'none' : 'flex' }}
              >
                {formData.name ? formData.name.charAt(0).toUpperCase() : '?'}
              </div>
            </div>
            {!isReadOnly && (
              <div className="avatar-url">
                <label className="form-label">Avatar URL</label>
                <input
                  type="url"
                  name="avatar"
                  value={formData.avatar}
                  onChange={handleInputChange}
                  className={`form-input ${errors.avatar ? 'error' : ''}`}
                  placeholder="https://example.com/avatar.jpg"
                />
                {errors.avatar && <span className="error-text">{errors.avatar}</span>}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`form-input ${errors.name ? 'error' : ''}`}
                placeholder="Enter user name"
                readOnly={isReadOnly}
                required
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="Enter email address"
                readOnly={isReadOnly}
                required
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Role</label>
              {isReadOnly ? (
                <div className="form-input" style={{ background: '#f8fafc', cursor: 'not-allowed' }}>
                  <span className={`role-badge role-${formData.role?.toLowerCase() || 'user'}`}>
                    {formData.role || 'Viewer'}
                  </span>
                </div>
              ) : (
                <select
                  name="role"
                  value={formData.role || 'Viewer'}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  <option value="Admin">👑 Admin</option>
                  <option value="Editor">✏️ Editor</option>
                  <option value="Viewer">👁️ Viewer</option>
                </select>
              )}
            </div>

            {user && (
              <div className="user-meta">
                <div className="meta-item">
                  <span className="meta-label">User ID</span>
                  <span className="meta-value">{user.id}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Created At</span>
                  <span className="meta-value">
                    {format(new Date(user.createdAt), 'MMM dd, yyyy HH:mm')}
                  </span>
                </div>
              </div>
            )}

            {errors.submit && (
              <div className="error-message">
                {errors.submit}
              </div>
            )}

            <div className="form-actions">
              {mode === 'view' && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      if (onRequestEdit) onRequestEdit();
                    }}
                    className="btn btn-primary"
                  >
                    ✏️ Edit User
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="btn btn-danger"
                    disabled={loading}
                  >
                    {loading ? 'Deleting...' : '🗑️ Delete User'}
                  </button>
                </>
              )}
              
              {mode === 'edit' && (
                <>
                  <button
                    type="button"
                    onClick={onClose}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : '💾 Save Changes'}
                  </button>
                </>
              )}
              
              {mode === 'create' && (
                <>
                  <button
                    type="button"
                    onClick={onClose}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Creating...' : '➕ Create User'}
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserModal;