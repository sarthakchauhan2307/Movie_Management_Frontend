import React from 'react';

const SeatGrid = ({ availableSeats, occupiedSeats = [], selectedSeats, onSeatClick, totalSeats = 120 }) => {
    // Calculate grid dimensions based on total seats
    // Aim for roughly square grid, with slightly more columns than rows for better cinema layout
    const cols = Math.ceil(Math.sqrt(totalSeats * 1.2)); // 1.2 ratio for wider layout
    const rows = Math.ceil(totalSeats / cols);

    // Generate seat layout
    const seatRows = Array.from({ length: rows }, (_, rowIndex) => {
        const rowLetter = String.fromCharCode(65 + rowIndex); // A, B, C...
        return Array.from({ length: cols }, (_, colIndex) => {
            const seatNumber = colIndex + 1;
            const seatId = `${rowLetter}${seatNumber}`;
            const seatIndex = rowIndex * cols + colIndex;

            // Seat exists if within totalSeats
            const exists = seatIndex < totalSeats;
            // Seat is occupied if it's in the occupiedSeats array
            const isOccupied = occupiedSeats.includes(seatId);
            // Seat is available if it exists and is not occupied
            const isAvailable = exists && !isOccupied;
            const isSelected = selectedSeats.includes(seatId);

            return {
                id: seatId,
                row: rowLetter,
                number: seatNumber,
                isAvailable,
                isOccupied,
                isSelected,
                exists // Whether this seat position actually exists
            };
        });
    });

    const getSeatStatus = (seat) => {
        if (seat.isSelected) return 'selected';
        if (seat.isOccupied) return 'occupied';
        if (!seat.isAvailable) return 'unavailable';
        return 'available';
    };

    const getSeatColor = (status) => {
        switch (status) {
            case 'selected':
                return 'var(--primary)';
            case 'occupied':
                return 'var(--text-muted)';
            case 'unavailable':
                return 'transparent';
            case 'available':
                return 'var(--border)';
            default:
                return 'var(--border)';
        }
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '40px',
            padding: '20px'
        }}>
            {/* Screen */}
            <div style={{
                width: '80%',
                maxWidth: '600px',
                height: '60px',
                background: 'linear-gradient(180deg, rgba(255,255,255,0.1), transparent)',
                borderRadius: '0 0 50% 50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderTop: '3px solid var(--primary)',
                color: 'var(--text-secondary)',
                fontSize: '0.9rem',
                fontWeight: '600',
                letterSpacing: '2px',
                transform: 'perspective(500px) rotateX(-15deg)',
                marginBottom: '20px'
            }}>
                SCREEN THIS WAY
            </div>

            {/* Seat Grid */}
            <div className="seat-grid-wrapper">
            <div style={{
                display: 'grid',
                gap: '8px'
            }}>
                {seatRows.map((row, rowIndex) => (
                    <div key={rowIndex} style={{
                        display: 'flex',
                        gap: '8px',
                        alignItems: 'center'
                    }}>
                        {/* Row Label */}
                        <div style={{
                            width: '30px',
                            textAlign: 'center',
                            color: 'var(--text-secondary)',
                            fontSize: '0.9rem',
                            fontWeight: '600'
                        }}>
                            {row[0].row}
                        </div>

                        {/* Seats */}
                        {row.map((seat) => {
                            // Skip rendering if seat doesn't exist
                            if (!seat.exists) {
                                return (
                                    <div
                                        key={seat.id}
                                        style={{
                                            width: '36px',
                                            height: '36px'
                                        }}
                                    />
                                );
                            }

                            const status = getSeatStatus(seat);
                            const isDisabled = status === 'occupied' || status === 'unavailable';

                            // Don't render unavailable seats (beyond totalSeats)
                            if (status === 'unavailable') {
                                return (
                                    <div
                                        key={seat.id}
                                        style={{
                                            width: '36px',
                                            height: '36px'
                                        }}
                                    />
                                );
                            }

                            return (
                                <button
                                    key={seat.id}
                                    disabled={isDisabled}
                                    onClick={() => !isDisabled && onSeatClick(seat.id)}
                                    style={{
                                        width: '36px',
                                        height: '36px',
                                        border: 'none',
                                        borderRadius: 'var(--radius-sm)',
                                        background: getSeatColor(status),
                                        cursor: isDisabled ? 'not-allowed' : 'pointer',
                                        transition: 'var(--transition)',
                                        position: 'relative',
                                        opacity: isDisabled ? 0.4 : 1
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isDisabled) {
                                            e.target.style.transform = 'scale(1.1)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.transform = 'scale(1)';
                                    }}
                                    title={seat.id}
                                />
                            );
                        })}
                    </div>
                ))}
            </div>
            </div>

            {/* Legend */}
            <div style={{
                display: 'flex',
                gap: '32px',
                justifyContent: 'center',
                flexWrap: 'wrap',
                marginTop: '20px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                        width: '20px',
                        height: '20px',
                        background: 'var(--border)',
                        borderRadius: 'var(--radius-sm)'
                    }} />
                    <span style={{ fontSize: '0.9rem' }}>Available</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                        width: '20px',
                        height: '20px',
                        background: 'var(--primary)',
                        borderRadius: 'var(--radius-sm)'
                    }} />
                    <span style={{ fontSize: '0.9rem' }}>Selected</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                        width: '20px',
                        height: '20px',
                        background: 'var(--text-muted)',
                        borderRadius: 'var(--radius-sm)',
                        opacity: 0.4
                    }} />
                    <span style={{ fontSize: '0.9rem' }}>Occupied</span>
                </div>
            </div>
        </div>
    );
};

export default SeatGrid;
