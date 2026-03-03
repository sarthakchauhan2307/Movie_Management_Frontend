import React from 'react';
import { X } from 'lucide-react';

const TrailerPlayer = ({ trailerUrl, isOpen, onClose }) => {
    if (!isOpen || !trailerUrl) return null;

    // Function to convert YouTube URLs to embed format
    const getEmbedUrl = (url) => {
        if (!url) return null;

        // Check if it's already an embed URL
        if (url.includes('youtube.com/embed/')) {
            return url;
        }

        // Convert youtube.com/watch?v= format
        const youtubeMatch = url.match(/youtube\.com\/watch\?v=([^&]+)/);
        if (youtubeMatch) {
            return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
        }

        // Convert youtu.be/ format
        const youtuBeMatch = url.match(/youtu\.be\/([^?]+)/);
        if (youtuBeMatch) {
            return `https://www.youtube.com/embed/${youtuBeMatch[1]}`;
        }

        // If it's a direct video URL (mp4, webm, etc.), return as is
        if (url.match(/\.(mp4|webm|ogg)$/i)) {
            return url;
        }

        // Default: assume it's already a valid embed URL
        return url;
    };

    const embedUrl = getEmbedUrl(trailerUrl);
    const isDirectVideo = trailerUrl.match(/\.(mp4|webm|ogg)$/i);

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999,
                padding: '20px',
                animation: 'fadeIn 0.2s ease-out'
            }}
            onClick={onClose}
        >
            {/* Modal Container */}
            <div
                style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: '1200px',
                    aspectRatio: '16/9',
                    backgroundColor: '#000',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                    animation: 'slideUp 0.3s ease-out'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        zIndex: 10,
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        color: 'white'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--primary)';
                        e.currentTarget.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
                        e.currentTarget.style.transform = 'scale(1)';
                    }}
                >
                    <X size={24} />
                </button>

                {/* Video Player */}
                {isDirectVideo ? (
                    <video
                        controls
                        autoPlay
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain'
                        }}
                    >
                        <source src={embedUrl} type={`video/${trailerUrl.match(/\.([^.]+)$/)[1]}`} />
                        Your browser does not support the video tag.
                    </video>
                ) : (
                    <iframe
                        src={embedUrl}
                        title="Movie Trailer"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={{
                            width: '100%',
                            height: '100%',
                            border: 'none'
                        }}
                    />
                )}
            </div>

            {/* Add animations */}
            <style>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                @keyframes slideUp {
                    from {
                        transform: translateY(50px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    );
};

export default TrailerPlayer;
