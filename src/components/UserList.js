import React, { useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import UserModal from './UserModal';
import './UserList.css';

const UserList = ({ users, onUserUpdate, onUserCreate, onUserDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('view');
  const [roleFilter, setRoleFilter] = useState('All');
  const [loading, setLoading] = useState(false);
  const usersPerPage = 10;

  // ===== EXPORT CSV FUNCTION =====
  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Role', 'Created At'];
    const rows = filteredAndSortedUsers.map(user => [
      user.name || 'Unknown',
      user.email || 'No email',
      user.role || 'User',
      user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('📥 CSV exported successfully!');
  };

  // ===== FILTER + SORT USERS =====
  const filteredAndSortedUsers = useMemo(() => {
    let filtered = users.filter(user => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        (user.name && user.name.toLowerCase().includes(searchLower)) ||
        (user.email && user.email.toLowerCase().includes(searchLower));
      
      const matchesRole = roleFilter === 'All' || user.role === roleFilter;
      
      return matchesSearch && matchesRole;
    });

    return filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === 'createdAt') {
        aValue = aValue ? new Date(aValue).getTime() : 0;
        bValue = bValue ? new Date(bValue).getTime() : 0;
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [users, searchTerm, roleFilter, sortBy, sortOrder]);

  const totalPages = Math.ceil(filteredAndSortedUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const paginatedUsers = filteredAndSortedUsers.slice(startIndex, startIndex + usersPerPage);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setModalMode('view');
    setShowModal(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setModalMode('edit');
    setShowModal(true);
  };

  const handleCreateUser = () => {
    setSelectedUser(null);
    setModalMode('create');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const handleUserSave = async (userData) => {
    setLoading(true);
    try {
      if (modalMode === 'create') {
        const newUser = await onUserCreate(userData);
        toast.success('✅ User created successfully!');
      } else if (modalMode === 'edit') {
        await onUserUpdate(userData);
        toast.success('✅ User updated successfully!');
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error saving user:', error);
      toast.error('❌ Failed to save user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUserDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setLoading(true);
      try {
        await onUserDelete(userId);
        toast.success('🗑️ User deleted successfully!');
        handleCloseModal();
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error('❌ Failed to delete user. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return '↕️';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  // Loading Skeleton
  if (loading && paginatedUsers.length === 0) {
    return (
      <div className="user-list-container">
        <div className="user-list-header">
          <h2 className="user-list-title">User Management</h2>
        </div>
        <div className="table-container">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} style={{ padding: '16px', borderBottom: '1px solid #e2e8f0' }}>
              <Skeleton height={40} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="user-list-container">
      <div className="user-list-header">
        <h2 className="user-list-title">User Management</h2>
        <div className="search-container">
          <input
            type="text"
            placeholder="🔍 Search users by name or email..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
          
          {/* ===== ROLE FILTER BUTTONS ===== */}
          <div className="role-filters">
            <button 
              className={`filter-btn ${roleFilter === 'All' ? 'active' : ''}`}
              onClick={() => setRoleFilter('All')}
            >
              All
            </button>
            <button 
              className={`filter-btn ${roleFilter === 'Admin' ? 'active' : ''}`}
              onClick={() => setRoleFilter('Admin')}
            >
              👑 Admin
            </button>
            <button 
              className={`filter-btn ${roleFilter === 'Editor' ? 'active' : ''}`}
              onClick={() => setRoleFilter('Editor')}
            >
              ✏️ Editor
            </button>
            <button 
              className={`filter-btn ${roleFilter === 'Viewer' ? 'active' : ''}`}
              onClick={() => setRoleFilter('Viewer')}
            >
              👁️ Viewer
            </button>
          </div>

          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field);
              setSortOrder(order);
            }}
            className="sort-select"
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
          </select>
          
          {/* ===== EXPORT CSV BUTTON ===== */}
          <button onClick={exportToCSV} className="btn btn-primary">
            📥 Export CSV
          </button>
          
          <button onClick={handleCreateUser} className="btn btn-primary">
            + Add User
          </button>
        </div>
      </div>

      {paginatedUsers.length === 0 ? (
        <div className="no-users">
          <p>No users found matching your search criteria.</p>
        </div>
      ) : (
        <>
          <div className="table-container">
            <table className="user-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('name')} className="sortable">
                    User {getSortIcon('name')}
                  </th>
                  <th>Email</th>
                  <th>Role</th>
                  <th onClick={() => handleSort('createdAt')} className="sortable">
                    Joined {getSortIcon('createdAt')}
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="user-cell">
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
                          <div className="user-name">
                            {user.name || 'Unknown User'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="user-email">
                        {user.email || 'No email provided'}
                      </div>
                    </td>
                    <td>
                      <span className={`role-badge role-${user.role?.toLowerCase() || 'user'}`}>
                        {user.role || 'User'}
                      </span>
                    </td>
                    <td>
                      <div className="user-date">
                        {user.createdAt ? format(new Date(user.createdAt), 'MMM dd, yyyy') : 'N/A'}
                      </div>
                    </td>
                    <td>
                      <div className="user-actions">
                        <button
                          onClick={() => handleUserClick(user)}
                          className="btn btn-sm btn-secondary"
                          title="View Details"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleEditUser(user)}
                          className="btn btn-sm btn-secondary"
                          title="Edit User"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleUserDelete(user.id)}
                          className="btn btn-sm btn-danger"
                          title="Delete User"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                First
              </button>
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={currentPage === pageNum ? 'active' : ''}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                Last
              </button>
            </div>
          )}

          <div className="pagination-info">
            Showing {startIndex + 1} to {Math.min(startIndex + usersPerPage, filteredAndSortedUsers.length)} of {filteredAndSortedUsers.length} users
          </div>
        </>
      )}

      {showModal && (
        <UserModal
          user={selectedUser}
          mode={modalMode}
          onClose={handleCloseModal}
          onSave={handleUserSave}
          onDelete={handleUserDelete}
          onRequestEdit={() => setModalMode('edit')}
        />
      )}
    </div>
  );
};

export default UserList;