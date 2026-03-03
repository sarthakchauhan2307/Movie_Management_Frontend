import React, { useState, useEffect } from 'react';
import { reviewAPI } from '../services/api';
import { getUserInfo } from '../services/authService';
import { Star, Send, TrendingUp, Edit2, X } from 'lucide-react';

// Reordered: Skip (2) → Timepass (1) → GoForIt (3) → Perfection (4)
const CATEGORIES = {
    2: { name: 'Skip', color: '#ef4444', emoji: '👎', order: 1 },
    1: { name: 'Timepass', color: '#fbbf24', emoji: '😐', order: 2 },
    3: { name: 'GoForIt', color: '#10b981', emoji: '👍', order: 3 },
    4: { name: 'Perfection', color: '#a855f7', emoji: '🌟', order: 4 }
};

// Order for display
const CATEGORY_ORDER = [2, 1, 3, 4];

const MovieReviewSection = ({ movieId }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(2); // Default to Skip
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });
    const [userInfo, setUserInfo] = useState(null);
    const [stats, setStats] = useState({ 1: 0, 2: 0, 3: 0, 4: 0 });
    const [editingReviewId, setEditingReviewId] = useState(null);

    useEffect(() => {
        const user = getUserInfo();
        setUserInfo(user);
        loadReviews();
    }, [movieId]);

    const loadReviews = async () => {
        try {
            setLoading(true);
            const data = await reviewAPI.getReviewsByMovie(movieId);
            setReviews(data);
            calculateStats(data);
        } catch (error) {
            console.error('Error loading reviews:', error);
            setMessage({ type: 'error', text: 'Failed to load reviews' });
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (reviewData) => {
        const newStats = { 1: 0, 2: 0, 3: 0, 4: 0 };
        reviewData.forEach(review => {
            if (newStats[review.category] !== undefined) {
                newStats[review.category]++;
            }
        });
        setStats(newStats);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!userInfo) {
            setMessage({ type: 'error', text: 'Please login to submit a review' });
            return;
        }

        try {
            setSubmitting(true);
            setMessage({ type: '', text: '' });

            const reviewData = {
                movieId: parseInt(movieId),
                category: selectedCategory,
                description: description.trim() || 'No description provided'
            };

            if (editingReviewId) {
                // Update existing review
                await reviewAPI.updateReview(editingReviewId, reviewData, userInfo.userId);
                setMessage({ type: 'success', text: '✨ Review updated successfully!' });
                setEditingReviewId(null);
            } else {
                // Create new review
                await reviewAPI.createReview(reviewData, userInfo.userId);
                setMessage({ type: 'success', text: '✨ Review submitted successfully!' });
            }

            setDescription('');
            setSelectedCategory(2); // Reset to Skip

            // Reload reviews
            await loadReviews();
        } catch (error) {
            console.error('Error submitting review:', error);
            setMessage({ type: 'error', text: error.response?.data || 'Failed to submit review' });
        } finally {
            setSubmitting(false);
        }
    };

    const handleEditReview = (review) => {
        setEditingReviewId(review.reviewId);
        setSelectedCategory(review.category);
        setDescription(review.description === 'No description provided' ? '' : review.description);
        setMessage({ type: '', text: '' });
        // Scroll to form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingReviewId(null);
        setDescription('');
        setSelectedCategory(2);
        setMessage({ type: '', text: '' });
    };

    const getSliderColor = () => CATEGORIES[selectedCategory].color;

    const totalReviews = Object.values(stats).reduce((sum, count) => sum + count, 0);
    const getPercentage = (count) => totalReviews > 0 ? ((count / totalReviews) * 100).toFixed(1) : 0;

    return (
        <div style={{
            background: 'var(--bg-secondary)',
            padding: '60px 0'
        }}>
            <div className="container">
                <h2 style={{
                    fontSize: '2.5rem',
                    fontWeight: '800',
                    marginBottom: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                }}>
                    <TrendingUp size={32} color="var(--primary)" />
                    Audience Reviews
                </h2>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                    gap: '40px',
                    marginBottom: '60px'
                }}>
                    {/* Review Statistics Chart */}
                    <div className="card" style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        padding: '32px'
                    }}>
                        <h3 style={{ marginBottom: '32px', fontSize: '1.5rem', textAlign: 'center' }}>
                            Review Distribution
                        </h3>

                        {/* Semi-Circular Gauge Meter */}
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            padding: '20px 0'
                        }}>
                            {/* Gauge SVG */}
                            <div style={{ position: 'relative', width: '360px', height: '200px', marginBottom: '40px' }}>
                                <svg width="360" height="200" viewBox="0 0 360 200">
                                    {(() => {
                                        const centerX = 180;
                                        const centerY = 180;
                                        const radius = 130;
                                        const strokeWidth = 24;
                                        const startAngle = -180;
                                        const totalAngle = 180;

                                        let currentAngle = startAngle;
                                        const arcs = CATEGORY_ORDER.map((category) => {
                                            const count = stats[category];
                                            const percentage = parseFloat(getPercentage(count));
                                            const cat = CATEGORIES[category];
                                            const sweepAngle = (percentage / 100) * totalAngle;

                                            // Calculate arc path
                                            const startRad = (currentAngle * Math.PI) / 180;
                                            const endRad = ((currentAngle + sweepAngle) * Math.PI) / 180;

                                            const x1 = centerX + radius * Math.cos(startRad);
                                            const y1 = centerY + radius * Math.sin(startRad);
                                            const x2 = centerX + radius * Math.cos(endRad);
                                            const y2 = centerY + radius * Math.sin(endRad);

                                            const largeArcFlag = sweepAngle > 180 ? 1 : 0;

                                            const pathData = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`;

                                            const arc = {
                                                path: pathData,
                                                color: cat.color,
                                                category: category
                                            };

                                            currentAngle += sweepAngle;
                                            return arc;
                                        }).filter(arc => arc !== null);

                                        return (
                                            <>
                                                {/* Background arc */}
                                                <path
                                                    d={`M ${centerX - radius} ${centerY} A ${radius} ${radius} 0 0 1 ${centerX + radius} ${centerY}`}
                                                    fill="none"
                                                    stroke="rgba(255,255,255,0.1)"
                                                    strokeWidth={strokeWidth}
                                                    strokeLinecap="round"
                                                />
                                                {/* Category arcs */}
                                                {arcs.map((arc, index) => (
                                                    <path
                                                        key={index}
                                                        d={arc.path}
                                                        fill="none"
                                                        stroke={arc.color}
                                                        strokeWidth={strokeWidth}
                                                        strokeLinecap="round"
                                                        style={{
                                                            transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)',
                                                            filter: `drop-shadow(0 0 8px ${arc.color}60)`
                                                        }}
                                                    />
                                                ))}
                                            </>
                                        );
                                    })()}
                                </svg>

                                {/* Center Display - Show dominant category */}
                                <div style={{
                                    position: 'absolute',
                                    top: '70%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    textAlign: 'center'
                                }}>
                                    {(() => {
                                        // Find dominant category
                                        const maxCategory = CATEGORY_ORDER.reduce((max, cat) =>
                                            stats[cat] > stats[max] ? cat : max
                                            , CATEGORY_ORDER[0]);
                                        const maxPercentage = parseFloat(getPercentage(stats[maxCategory]));
                                        const dominantCat = CATEGORIES[maxCategory];

                                        return (
                                            <>
                                                <div style={{
                                                    fontSize: '3rem',
                                                    fontWeight: '800',
                                                    color: dominantCat.color,
                                                    lineHeight: 1,
                                                    marginBottom: '8px'
                                                }}>
                                                    {maxPercentage.toFixed(0)}%
                                                </div>
                                                <div style={{
                                                    fontSize: '0.9rem',
                                                    color: 'var(--text-secondary)',
                                                    fontWeight: '500'
                                                }}>
                                                    {stats[maxCategory]}/{totalReviews} Reviews
                                                </div>
                                            </>
                                        );
                                    })()}
                                </div>
                            </div>

                            {/* Legend */}
                            <div style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                justifyContent: 'center',
                                gap: '24px',
                                marginTop: '16px'
                            }}>
                                {CATEGORY_ORDER.map((category) => {
                                    const cat = CATEGORIES[category];
                                    const percentage = parseFloat(getPercentage(stats[category]));

                                    return (
                                        <div key={category} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}>
                                            <div style={{
                                                width: '12px',
                                                height: '12px',
                                                borderRadius: '50%',
                                                background: cat.color,
                                                boxShadow: `0 0 8px ${cat.color}80`
                                            }} />
                                            <span style={{
                                                fontSize: '0.95rem',
                                                fontWeight: '600',
                                                color: 'white'
                                            }}>
                                                {cat.emoji} {cat.name}
                                            </span>
                                            <span style={{
                                                fontSize: '0.9rem',
                                                color: cat.color,
                                                fontWeight: '700'
                                            }}>
                                                {percentage.toFixed(0)}%
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Submit Review Form */}
                    <div className="card" style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        padding: '32px'
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '24px'
                        }}>
                            <h3 style={{ fontSize: '1.5rem', margin: 0 }}>
                                {editingReviewId ? '✍️ Edit Your Review' : 'Share Your Review'}
                            </h3>
                            {editingReviewId && (
                                <button
                                    type="button"
                                    onClick={handleCancelEdit}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        padding: '8px 12px',
                                        background: 'rgba(239, 68, 68, 0.2)',
                                        border: '1px solid #ef4444',
                                        borderRadius: '6px',
                                        color: '#ef4444',
                                        fontSize: '0.9rem',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.3)'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
                                >
                                    <X size={16} />
                                    Cancel Edit
                                </button>
                            )}
                        </div>

                        <form onSubmit={handleSubmit}>
                            {/* Category Slider */}
                            <div style={{ marginBottom: '32px' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '16px',
                                    fontWeight: '600',
                                    fontSize: '1rem'
                                }}>
                                    Rating Category
                                </label>

                                {/* Selected Category Display */}
                                <div style={{
                                    textAlign: 'center',
                                    marginBottom: '20px',
                                    padding: '16px',
                                    background: `${getSliderColor()}20`,
                                    borderRadius: '12px',
                                    border: `2px solid ${getSliderColor()}`,
                                    transition: 'all 0.3s ease'
                                }}>
                                    <span style={{
                                        fontSize: '2rem',
                                        display: 'block',
                                        marginBottom: '8px'
                                    }}>
                                        {CATEGORIES[selectedCategory].emoji}
                                    </span>
                                    <span style={{
                                        fontSize: '1.3rem',
                                        fontWeight: '700',
                                        color: getSliderColor()
                                    }}>
                                        {CATEGORIES[selectedCategory].name}
                                    </span>
                                </div>

                                {/* Custom Slider */}
                                <div style={{ position: 'relative', padding: '0 10px' }}>
                                    <input
                                        type="range"
                                        min="0"
                                        max="3"
                                        step="1"
                                        value={CATEGORY_ORDER.indexOf(selectedCategory)}
                                        onChange={(e) => setSelectedCategory(CATEGORY_ORDER[parseInt(e.target.value)])}
                                        style={{
                                            width: '100%',
                                            height: '8px',
                                            borderRadius: '4px',
                                            background: `linear-gradient(to right, 
                                                ${CATEGORIES[2].color} 0%, 
                                                ${CATEGORIES[1].color} 33%, 
                                                ${CATEGORIES[3].color} 66%, 
                                                ${CATEGORIES[4].color} 100%)`,
                                            outline: 'none',
                                            cursor: 'pointer',
                                            WebkitAppearance: 'none',
                                            appearance: 'none'
                                        }}
                                    />

                                    {/* Category Labels */}
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        marginTop: '8px',
                                        fontSize: '0.75rem',
                                        color: 'var(--text-secondary)'
                                    }}>
                                        {CATEGORY_ORDER.map((cat) => (
                                            <span
                                                key={cat}
                                                style={{
                                                    color: selectedCategory === cat ? CATEGORIES[cat].color : 'var(--text-secondary)',
                                                    fontWeight: selectedCategory === cat ? '700' : '400',
                                                    transition: 'all 0.3s ease'
                                                }}
                                            >
                                                {CATEGORIES[cat].name}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <style>{`
                                    input[type="range"]::-webkit-slider-thumb {
                                        -webkit-appearance: none;
                                        appearance: none;
                                        width: 24px;
                                        height: 24px;
                                        border-radius: 50%;
                                        background: ${getSliderColor()};
                                        cursor: pointer;
                                        box-shadow: 0 0 20px ${getSliderColor()}80;
                                        border: 3px solid white;
                                        transition: all 0.3s ease;
                                    }
                                    
                                    input[type="range"]::-webkit-slider-thumb:hover {
                                        transform: scale(1.2);
                                        box-shadow: 0 0 30px ${getSliderColor()};
                                    }
                                    
                                    input[type="range"]::-moz-range-thumb {
                                        width: 24px;
                                        height: 24px;
                                        border-radius: 50%;
                                        background: ${getSliderColor()};
                                        cursor: pointer;
                                        box-shadow: 0 0 20px ${getSliderColor()}80;
                                        border: 3px solid white;
                                        transition: all 0.3s ease;
                                    }
                                    
                                    input[type="range"]::-moz-range-thumb:hover {
                                        transform: scale(1.2);
                                        box-shadow: 0 0 30px ${getSliderColor()};
                                    }
                                `}</style>
                            </div>

                            {/* Description Textarea */}
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '8px',
                                    fontWeight: '600',
                                    fontSize: '1rem'
                                }}>
                                    Your Review
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Share your thoughts about this movie... (optional)"
                                    rows="4"
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        borderRadius: '8px',
                                        color: 'white',
                                        fontSize: '1rem',
                                        fontFamily: 'inherit',
                                        resize: 'vertical',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = 'var(--primary)';
                                        e.target.style.background = 'rgba(255,255,255,0.08)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = 'rgba(255,255,255,0.2)';
                                        e.target.style.background = 'rgba(255,255,255,0.05)';
                                    }}
                                />
                            </div>

                            {/* Message Display */}
                            {message.text && (
                                <div style={{
                                    padding: '12px 16px',
                                    borderRadius: '8px',
                                    marginBottom: '16px',
                                    background: message.type === 'success'
                                        ? 'rgba(16, 185, 129, 0.2)'
                                        : 'rgba(239, 68, 68, 0.2)',
                                    border: `1px solid ${message.type === 'success' ? '#10b981' : '#ef4444'}`,
                                    color: message.type === 'success' ? '#10b981' : '#ef4444',
                                    fontSize: '0.95rem'
                                }}>
                                    {message.text}
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={submitting || !userInfo}
                                className="btn btn-primary"
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    padding: '14px',
                                    fontSize: '1.05rem',
                                    fontWeight: '600'
                                }}
                            >
                                {submitting ? (
                                    <>
                                        <div className="spinner" style={{ width: '16px', height: '16px' }} />
                                        {editingReviewId ? 'Updating...' : 'Submitting...'}
                                    </>
                                ) : (
                                    <>
                                        <Send size={18} />
                                        {editingReviewId ? 'Update Review' : 'Submit Review'}
                                    </>
                                )}
                            </button>

                            {!userInfo && (
                                <p style={{
                                    marginTop: '12px',
                                    fontSize: '0.9rem',
                                    color: 'var(--text-secondary)',
                                    textAlign: 'center'
                                }}>
                                    Please login to submit a review
                                </p>
                            )}
                        </form>
                    </div>
                </div>

                {/* Reviews List */}
                <div>
                    <h3 style={{
                        fontSize: '2rem',
                        fontWeight: '700',
                        marginBottom: '32px'
                    }}>
                        All Reviews ({reviews.length})
                    </h3>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '40px' }}>
                            <div className="spinner" />
                        </div>
                    ) : reviews.length === 0 ? (
                        <div className="card" style={{
                            padding: '60px 40px',
                            textAlign: 'center',
                            color: 'var(--text-secondary)'
                        }}>
                            <Star size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                            <p style={{ fontSize: '1.1rem' }}>No reviews yet. Be the first to review!</p>
                        </div>
                    ) : (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                            gap: '24px'
                        }}>
                            {reviews.map((review) => {
                                const category = CATEGORIES[review.category];
                                return (
                                    <div
                                        key={review.reviewId}
                                        className="card"
                                        style={{
                                            background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
                                            backdropFilter: 'blur(10px)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            padding: '24px',
                                            transition: 'all 0.3s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-4px)';
                                            e.currentTarget.style.borderColor = category?.color || 'rgba(255,255,255,0.2)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                                        }}
                                    >
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'flex-start',
                                            marginBottom: '16px'
                                        }}>
                                            <div>
                                                <div style={{
                                                    fontWeight: '600',
                                                    fontSize: '1.05rem',
                                                    marginBottom: '4px'
                                                }}>
                                                    User #{review.userId}
                                                </div>
                                                <div style={{
                                                    fontSize: '0.85rem',
                                                    color: 'var(--text-secondary)'
                                                }}>
                                                    {new Date(review.createdAt).toLocaleDateString('en-IN', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                {category && (
                                                    <span style={{
                                                        padding: '6px 14px',
                                                        borderRadius: '20px',
                                                        background: `${category.color}20`,
                                                        color: category.color,
                                                        fontSize: '0.85rem',
                                                        fontWeight: '700',
                                                        border: `1px solid ${category.color}`,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '4px'
                                                    }}>
                                                        <span>{category.emoji}</span>
                                                        {category.name}
                                                    </span>
                                                )}
                                                {/* Edit button - only show for user's own reviews */}
                                                {userInfo && review.userId === userInfo.userId && (
                                                    <button
                                                        onClick={() => handleEditReview(review)}
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '4px',
                                                            padding: '6px 12px',
                                                            background: 'rgba(168, 85, 247, 0.2)',
                                                            border: '1px solid #a855f7',
                                                            borderRadius: '6px',
                                                            color: '#a855f7',
                                                            fontSize: '0.85rem',
                                                            fontWeight: '600',
                                                            cursor: 'pointer',
                                                            transition: 'all 0.3s ease'
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.style.background = 'rgba(168, 85, 247, 0.3)';
                                                            e.currentTarget.style.transform = 'scale(1.05)';
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.background = 'rgba(168, 85, 247, 0.2)';
                                                            e.currentTarget.style.transform = 'scale(1)';
                                                        }}
                                                    >
                                                        <Edit2 size={14} />
                                                        Edit
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <p style={{
                                            color: 'var(--text-secondary)',
                                            lineHeight: 1.7,
                                            fontSize: '0.95rem'
                                        }}>
                                            {review.description}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MovieReviewSection;
