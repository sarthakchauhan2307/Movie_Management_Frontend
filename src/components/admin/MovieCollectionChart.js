import React, { useEffect, useRef, useState } from 'react';
import { adminAnalyticsAPI } from '../../services/adminApi';

const MovieCollectionChart = () => {
    const chartRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [collectionData, setCollectionData] = useState([]);

    useEffect(() => {
        loadGoogleCharts();
    }, []);

    const loadGoogleCharts = () => {
        // Load Google Charts library
        const script = document.createElement('script');
        script.src = 'https://www.gstatic.com/charts/loader.js';
        script.async = true;
        script.onload = () => {
            window.google.charts.load('current', { packages: ['corechart'] });
            window.google.charts.setOnLoadCallback(fetchDataAndDrawChart);
        };
        document.head.appendChild(script);
    };

    const fetchDataAndDrawChart = async () => {
        try {
            setLoading(true);
            const data = await adminAnalyticsAPI.getMovieWiseCollection();

            // Filter out movies with zero collection
            const filteredData = data.filter(movie => movie.movieCollection > 0);

            // Sort by collection (highest first) and take top 5
            const top5Movies = filteredData
                .sort((a, b) => b.movieCollection - a.movieCollection)
                .slice(0, 5);

            setCollectionData(top5Movies);

            if (top5Movies.length > 0) {
                drawChart(top5Movies);
            } else {
                setError('No collection data available');
            }
        } catch (err) {
            console.error('Error fetching movie collection data:', err);
            setError('Failed to load collection data');
        } finally {
            setLoading(false);
        }
    };

    const drawChart = (data) => {
        if (!window.google || !chartRef.current) return;

        // Prepare data for Google Charts
        const chartData = new window.google.visualization.DataTable();
        chartData.addColumn('string', 'Movie');
        chartData.addColumn('number', 'Collection');
        chartData.addColumn({ type: 'string', role: 'style' });

        // Define a modern color palette
        const colors = [
            '#667eea', // Purple
            '#f093fb', // Pink
            '#4facfe', // Blue
            '#43e97b', // Green
            '#fa709a', // Coral
            '#feca57', // Yellow
            '#48dbfb', // Cyan
            '#ff6b6b', // Red
        ];

        data.forEach((movie, index) => {
            const color = colors[index % colors.length];
            chartData.addRow([
                movie.title,
                movie.movieCollection,
                color
            ]);
        });

        const options = {
            title: 'Top 5 Movie Collections',
            titleTextStyle: {
                color: '#e0e0e0',
                fontSize: 20,
                bold: true,
            },
            backgroundColor: 'transparent',
            chartArea: {
                width: '75%',
                height: '70%',
                backgroundColor: 'transparent',
            },
            hAxis: {
                title: 'Collection (₹)',
                titleTextStyle: {
                    color: '#b0b0b0',
                    fontSize: 14,
                },
                textStyle: {
                    color: '#b0b0b0',
                    fontSize: 12,
                },
                gridlines: {
                    color: '#333',
                },
                minorGridlines: {
                    color: 'transparent',
                },
            },
            vAxis: {
                title: 'Movies',
                titleTextStyle: {
                    color: '#b0b0b0',
                    fontSize: 14,
                },
                textStyle: {
                    color: '#b0b0b0',
                    fontSize: 12,
                },
                gridlines: {
                    color: '#333',
                },
            },
            legend: { position: 'none' },
            animation: {
                startup: true,
                duration: 1000,
                easing: 'out',
            },
            bar: { groupWidth: '75%' },
        };

        const chart = new window.google.visualization.BarChart(chartRef.current);
        chart.draw(chartData, options);
    };

    if (loading) {
        return (
            <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
                <div className="spinner" style={{ margin: '0 auto' }}></div>
                <p style={{ marginTop: '16px', color: 'var(--text-secondary)' }}>
                    Loading collection data...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
                <h3 style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    {error}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    Movie collection data will appear here once bookings are made.
                </p>
            </div>
        );
    }

    return (
        <div className="card" style={{ padding: '24px' }}>
            <div style={{ marginBottom: '16px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '8px' }}>
                    📊 Top 5 Movie Collections
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    Highest grossing movies with active bookings
                </p>
            </div>

            {/* Collection Summary */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                marginBottom: '24px',
                padding: '16px',
                background: 'var(--bg-secondary)',
                borderRadius: '8px'
            }}>
                <div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '4px' }}>
                        Total Movies
                    </p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>
                        {collectionData.length}
                    </p>
                </div>
                <div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '4px' }}>
                        Total Collection
                    </p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--success)' }}>
                        ₹{collectionData.reduce((sum, m) => sum + m.movieCollection, 0).toLocaleString('en-IN')}
                    </p>
                </div>
                <div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '4px' }}>
                        Top Performer
                    </p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--warning)' }}>
                        {collectionData[0]?.title || 'N/A'}
                    </p>
                </div>
            </div>

            {/* Chart */}
            <div
                ref={chartRef}
                style={{
                    width: '100%',
                    height: '400px',
                    minHeight: '400px'
                }}
            />
        </div>
    );
};

export default MovieCollectionChart;
