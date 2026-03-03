import React from 'react';
import '../../styles/admin.css';

const StatsCard = ({ title, value, icon, color = 'primary', change, changeType, subtitle }) => {
    return (
        <div className="stats-card">
            <div className="stats-header">
                <span className="stats-title">{title}</span>
                <div className={`stats-icon ${color}`}>
                    {icon}
                </div>
            </div>
            <div className="stats-value">{value}</div>
            {subtitle && (
                <div style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    marginTop: '4px',
                    fontWeight: 500
                }}>
                    {subtitle}
                </div>
            )}
            {change && (
                <div className={`stats-change ${changeType}`}>
                    <span>{changeType === 'positive' ? '↑' : '↓'}</span>
                    <span>{change}</span>
                </div>
            )}
        </div>
    );
};

export default StatsCard;
