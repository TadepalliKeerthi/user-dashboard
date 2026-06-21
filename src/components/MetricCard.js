import React from 'react';
import './MetricCard.css';

const MetricCard = ({ title, value, trend, trendValue, icon }) => {
  const formatValue = (val) => {
    if (typeof val === 'number') {
      return val.toLocaleString();
    }
    return val;
  };

  return (
    <div className="metric-card">
      <div className="metric-header">
        {icon && <div className="metric-icon">{icon}</div>}
        <div className="metric-content">
          <div className="metric-value">{formatValue(value)}</div>
          <div className="metric-label">{title}</div>
          {trend && trendValue && (
            <div className={`metric-change ${trend}`}>
              {trendValue}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MetricCard;