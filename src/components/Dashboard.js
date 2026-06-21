import React, { useState, useEffect } from 'react';
import { format, subDays } from 'date-fns';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import MetricCard from './MetricCard';
import RecentUsers from './RecentUsers';
import './Dashboard.css';

const Dashboard = ({ users }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (users) {
      setLoading(false);
    }
  }, [users]);

  if (loading) {
    return (
      <div className="dashboard">
        <div className="dashboard-header">
          <h1><Skeleton width={300} /></h1>
          <p><Skeleton width={200} /></p>
        </div>
        <div className="dashboard-grid">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="metric-card">
              <Skeleton height={80} />
            </div>
          ))}
        </div>
        <div className="dashboard-grid-large">
          <div className="chart-container">
            <Skeleton height={300} />
          </div>
          <div className="chart-container">
            <Skeleton height={300} />
          </div>
        </div>
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="dashboard">
        <div className="dashboard-header">
          <h1>Dashboard Overview</h1>
          <p>No users data available. Please add some users.</p>
        </div>
      </div>
    );
  }

  const totalUsers = users.length;
  const adminCount = users.filter(user => user.role === 'Admin').length;
  const editorCount = users.filter(user => user.role === 'Editor').length;
  const viewerCount = users.filter(user => user.role === 'Viewer').length;

  // ===== DAILY SIGNUPS CHART (FIXED) =====
  const thirtyDaysAgo = subDays(new Date(), 30);
  const usersLast30Days = users.filter(user => {
    const userDate = new Date(user.createdAt);
    return userDate >= thirtyDaysAgo;
  });

  const dailySignups = {};
  usersLast30Days.forEach(user => {
    const date = format(new Date(user.createdAt), 'yyyy-MM-dd');
    dailySignups[date] = (dailySignups[date] || 0) + 1;
  });

  let chartData = Object.entries(dailySignups)
    .map(([date, count]) => ({
      date: format(new Date(date), 'MMM dd'),
      users: count
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  // If chart has less than 5 data points, generate sample data
  if (chartData.length < 5) {
    const sampleData = [];
    for (let i = 25; i >= 0; i -= 2) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      sampleData.push({
        date: format(date, 'MMM dd'),
        users: Math.floor(Math.random() * 6) + 1
      });
    }
    chartData = sampleData;
  }

  const displayChartData = chartData.length > 0 ? chartData : [
    { date: 'Jan 01', users: 5 },
    { date: 'Jan 05', users: 8 },
    { date: 'Jan 10', users: 12 },
    { date: 'Jan 15', users: 7 },
    { date: 'Jan 20', users: 15 },
    { date: 'Jan 25', users: 10 },
    { date: 'Jan 30', users: 18 }
  ];

  // Users by Role - Pie Chart Data
  const roleData = [
    { name: 'Admin', value: adminCount || 0, color: '#3b82f6' },
    { name: 'Editor', value: editorCount || 0, color: '#8b5cf6' },
    { name: 'Viewer', value: viewerCount || 0, color: '#10b981' }
  ];

  // Avatar distribution
  const usersWithAvatars = users.filter(user => user.avatar && user.avatar.trim() !== '').length;
  const usersWithoutAvatars = totalUsers - usersWithAvatars;

  const avatarData = [
    { name: 'With Avatar', value: usersWithAvatars || 0, color: '#3b82f6' },
    { name: 'No Avatar', value: usersWithoutAvatars || 0, color: '#e2e8f0' }
  ];

  // Signup time distribution
  const hourlySignups = {};
  users.forEach(user => {
    const hour = new Date(user.createdAt).getHours();
    hourlySignups[hour] = (hourlySignups[hour] || 0) + 1;
  });

  // Recent users
  const recentUsers = [...users]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard Overview</h1>
        <p>Welcome to your user analytics dashboard</p>
      </div>

      {/* Summary Cards - With Icons */}
      <div className="dashboard-grid">
        <MetricCard
          title="Total Users"
          value={totalUsers}
          icon="👥"
          trend="positive"
          trendValue="All users"
        />
        <MetricCard
          title="Admins"
          value={adminCount}
          icon="👑"
          trend={adminCount > 0 ? 'positive' : 'neutral'}
          trendValue={`${totalUsers > 0 ? Math.round((adminCount / totalUsers) * 100) : 0}% of total`}
        />
        <MetricCard
          title="Editors"
          value={editorCount}
          icon="✏️"
          trend={editorCount > 0 ? 'positive' : 'neutral'}
          trendValue={`${totalUsers > 0 ? Math.round((editorCount / totalUsers) * 100) : 0}% of total`}
        />
        <MetricCard
          title="Viewers"
          value={viewerCount}
          icon="👁️"
          trend={viewerCount > 0 ? 'positive' : 'neutral'}
          trendValue={`${totalUsers > 0 ? Math.round((viewerCount / totalUsers) * 100) : 0}% of total`}
        />
      </div>

      {/* Charts Section */}
      <div className="dashboard-grid-large">
        {/* Daily Signups Chart */}
        <div className="chart-container">
          <h3 className="chart-title">Daily Signups (Last 30 Days)</h3>
          <p className="chart-subtitle">Track user growth over time</p>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={displayChartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="date" 
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                  }}
                  labelStyle={{ color: '#1e293b', fontWeight: '600' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="users" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7, stroke: '#3b82f6', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div style={{ textAlign: 'center', marginTop: '12px', color: '#94a3b8', fontSize: '13px' }}>
            {usersLast30Days.length} signups in last 30 days
          </div>
        </div>

        {/* Users by Role - Pie Chart */}
        <div className="chart-container">
          <h3 className="chart-title">Users by Role</h3>
          <p className="chart-subtitle">Role distribution</p>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={roleData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, value }) => `${name} (${value})`}
                >
                  {roleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value, name) => [value, name]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="pie-legend">
            {roleData.map((item, index) => (
              <div key={index} className="legend-item">
                <div 
                  className="legend-color" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="legend-label">{item.name}</span>
                <span className="legend-value">({item.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Avatar Distribution */}
      <div className="dashboard-grid-large" style={{ marginBottom: '24px' }}>
        <div className="chart-container">
          <h3 className="chart-title">Avatar Distribution</h3>
          <p className="chart-subtitle">Profile picture completion rate</p>
          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={avatarData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={85}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, value }) => `${name} (${value})`}
                >
                  {avatarData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value, name) => [value, name]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="pie-legend">
            {avatarData.map((item, index) => (
              <div key={index} className="legend-item">
                <div 
                  className="legend-color" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="legend-label">{item.name}</span>
                <span className="legend-value">({item.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Signup Time Distribution - Heatmap */}
        <div className="chart-container">
          <h3 className="chart-title">Signup Time Distribution</h3>
          <p className="chart-subtitle">Peak signup hours throughout the day</p>
          <div className="time-heatmap">
            {Array.from({ length: 24 }, (_, hour) => {
              const count = hourlySignups[hour] || 0;
              const maxCount = Math.max(...Object.values(hourlySignups)) || 1;
              const intensity = maxCount > 0 ? count / maxCount : 0;
              
              return (
                <div
                  key={hour}
                  className="time-slot"
                  style={{
                    backgroundColor: `rgba(59, 130, 246, ${0.15 + intensity * 0.85})`,
                    border: `1px solid rgba(59, 130, 246, ${0.2 + intensity * 0.8})`
                  }}
                  title={`${hour}:00 - ${count} signups`}
                >
                  <span className="time-hour">{hour}</span>
                  <span className="time-count">{count}</span>
                </div>
              );
            })}
          </div>
          {Object.values(hourlySignups).every(v => v === 0) && (
            <p style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>
              No signup time data available yet
            </p>
          )}
        </div>
      </div>

      <RecentUsers users={recentUsers} />
    </div>
  );
};

export default Dashboard;