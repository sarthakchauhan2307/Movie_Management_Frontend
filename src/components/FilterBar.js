import React from 'react';

const FilterBar = ({ activeFilter, onFilterChange }) => {
    const filters = [
        { id: 'all', label: 'All Movies' },
        { id: 'now-showing', label: 'Now Showing' },
        { id: 'coming-soon', label: 'Coming Soon' },
    ];

    const genres = ['Action', 'Drama', 'Comedy', 'Thriller', 'Sci-Fi', 'Horror', 'Romance'];

    return (
        <div style={{
            background: 'var(--bg-secondary)',
            padding: '20px 0',
            borderBottom: '1px solid var(--border)',
            position: 'sticky',
            top: '73px',
            zIndex: 999,
            backdropFilter: 'blur(10px)'
        }}>
            <div className="container">
                {/* Status Filters */}
                <div style={{
                    display: 'flex',
                    gap: '12px',
                    marginBottom: '16px',
                    flexWrap: 'wrap'
                }}>
                    {filters.map(filter => (
                        <button
                            key={filter.id}
                            onClick={() => onFilterChange('status', filter.id)}
                            className={`chip ${activeFilter.status === filter.id ? 'active' : ''}`}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>

                {/* Genre Filters */}
                <div style={{
                    display: 'flex',
                    gap: '12px',
                    overflowX: 'auto',
                    paddingBottom: '4px'
                }}>
                    <span style={{
                        color: 'var(--text-secondary)',
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        flexShrink: 0
                    }}>
                        Genres:
                    </span>
                    {genres.map(genre => (
                        <button
                            key={genre}
                            onClick={() => onFilterChange('genre', genre)}
                            className={`chip ${activeFilter.genre === genre ? 'active' : ''}`}
                        >
                            {genre}
                        </button>
                    ))}
                    <button
                        onClick={() => onFilterChange('genre', null)}
                        className="chip"
                        style={{
                            color: 'var(--text-muted)',
                            textDecoration: 'underline'
                        }}
                    >
                        Clear
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FilterBar;
