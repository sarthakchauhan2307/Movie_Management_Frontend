import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Film, Users, Shield, Headphones, Star, MapPin, Clock, CreditCard,
    ChevronDown, ChevronUp, Ticket, Monitor, Smartphone, Award,
    Heart, Zap, Globe, ArrowLeft
} from 'lucide-react';

const AboutUs = () => {
    const [openFaq, setOpenFaq] = useState(null);

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const stats = [
        { icon: <Film size={28} />, value: '500+', label: 'Movies Listed' },
        { icon: <Users size={28} />, value: '10K+', label: 'Happy Users' },
        { icon: <MapPin size={28} />, value: '50+', label: 'Cities Covered' },
        { icon: <Ticket size={28} />, value: '1M+', label: 'Tickets Booked' }
    ];

    const features = [
        {
            icon: <Monitor size={32} />,
            title: 'Interactive Seat Selection',
            desc: 'Choose your perfect seats with our real-time interactive seat map. See seat availability live and pick the best spot in the house.'
        },
        {
            icon: <Clock size={32} />,
            title: 'Flexible Show Timings',
            desc: 'Browse shows by date, time, and theatre. Find the perfect showtime that fits your schedule across multiple screens.'
        },
        {
            icon: <Star size={32} />,
            title: 'Movie Reviews & Ratings',
            desc: 'Read and write reviews, rate movies, and help the community discover great films. Make informed decisions before booking.'
        },
        {
            icon: <CreditCard size={32} />,
            title: 'Secure Booking',
            desc: 'Your transactions are safe with us. Book with confidence and receive instant e-ticket confirmations.'
        },
        {
            icon: <Globe size={32} />,
            title: 'Multi-City Support',
            desc: 'Browse movies and theatres across multiple cities. Switch between cities effortlessly to find shows near you.'
        },
        {
            icon: <Zap size={32} />,
            title: 'Box Office Collections',
            desc: 'Stay updated with the latest box office numbers. Track how your favorite movies are performing at the box office.'
        }
    ];

    const teamValues = [
        {
            icon: <Heart size={24} />,
            title: 'User First',
            desc: 'Every feature we build starts with the question: how does this make the movie-going experience better?'
        },
        {
            icon: <Shield size={24} />,
            title: 'Trust & Security',
            desc: 'We ensure your personal data and payment information are always protected with industry-standard security.'
        },
        {
            icon: <Award size={24} />,
            title: 'Quality Experience',
            desc: 'From browsing to booking to watching — we aim to make every step seamless and enjoyable.'
        }
    ];

    const faqs = [
        {
            question: 'How do I book a movie ticket on CineBook?',
            answer: 'Booking is simple! Browse movies on the home page, select your preferred movie, choose a showtime and theatre, pick your seats from the interactive seat map, and confirm your booking. You\'ll receive an instant e-ticket confirmation.'
        },
        {
            question: 'Can I select specific seats while booking?',
            answer: 'Yes! CineBook offers an interactive seat selection feature. Once you choose a show, you\'ll see a real-time seat map showing available, booked, and selected seats. Simply click on your preferred seats to select them.'
        },
        {
            question: 'How do I check my booking history?',
            answer: 'You can view all your bookings by clicking on "My Bookings" in the navigation bar. This page shows your complete booking history including upcoming and past bookings with all the details like movie name, theatre, seats, and show timing.'
        },
        {
            question: 'Can I filter movies by genre or status?',
            answer: 'Absolutely! On the home page, you\'ll find filter options to browse movies by their status (Now Showing, Coming Soon) and by genre (Action, Drama, Comedy, Thriller, Sci-Fi, Horror, Romance). You can also search for specific movies using the search bar.'
        },
        {
            question: 'Does CineBook support multiple cities?',
            answer: 'Yes, CineBook supports multiple cities across India. You can select your city from the location dropdown in the navigation bar to see movies and theatres available in your area. Switch between cities anytime to explore shows in different locations.'
        },
        {
            question: 'How can I write a review for a movie?',
            answer: 'After watching a movie, go to the movie\'s detail page and scroll down to the Reviews section. You can rate the movie out of 10 stars and write your review to share your experience with other users.'
        },
        {
            question: 'What is the Box Office Collection feature?',
            answer: 'The Collections page shows you real-time box office performance data of movies. You can see how much each movie has collected, compare performances, and stay updated with the latest box office trends.'
        },
        {
            question: 'Can I book tickets for upcoming/coming soon movies?',
            answer: 'Yes! If advance booking is available for a coming soon movie, you\'ll see an "Advance Booking" badge on the movie card. You can select shows and book seats just like any other movie that\'s currently showing.'
        },
        {
            question: 'How do I update my profile information?',
            answer: 'Click on your username in the navigation bar or go to "My Profile" to view and update your personal information including your name, email, and other details.'
        },
        {
            question: 'Is there an admin panel for theatre management?',
            answer: 'Yes, CineBook has a comprehensive admin panel for managing movies, theatres, screens, shows, bookings, and users. Admins can also view detailed analytics including movie collection charts and booking statistics.'
        }
    ];

    return (
        <div>
            {/* Hero Section */}
            <div style={{
                background: 'linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)',
                padding: '40px 0 60px',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Decorative background elements */}
                <div style={{
                    position: 'absolute',
                    top: '-100px',
                    right: '-100px',
                    width: '400px',
                    height: '400px',
                    background: 'radial-gradient(circle, rgba(220, 38, 38, 0.08) 0%, transparent 70%)',
                    borderRadius: '50%',
                    pointerEvents: 'none'
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: '-80px',
                    left: '-80px',
                    width: '300px',
                    height: '300px',
                    background: 'radial-gradient(circle, rgba(225, 29, 72, 0.06) 0%, transparent 70%)',
                    borderRadius: '50%',
                    pointerEvents: 'none'
                }} />

                <div className="container">
                    <Link to="/" style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: 'var(--text-secondary)',
                        textDecoration: 'none',
                        fontSize: '0.9rem',
                        marginBottom: '24px',
                        transition: 'var(--transition)'
                    }}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                    >
                        <ArrowLeft size={18} />
                        Back to Home
                    </Link>

                    <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '16px',
                            marginBottom: '24px'
                        }}>
                            <div style={{
                                background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                                padding: '16px',
                                borderRadius: 'var(--radius-lg)',
                                display: 'flex'
                            }}>
                                <Film size={40} color="white" />
                            </div>
                            <h1 style={{
                                fontSize: '3rem',
                                fontWeight: '800',
                                background: 'linear-gradient(135deg, var(--text-primary), var(--text-secondary))',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}>
                                About CineBook
                            </h1>
                        </div>
                        <p style={{
                            color: 'var(--text-secondary)',
                            fontSize: '1.15rem',
                            lineHeight: '1.8',
                            maxWidth: '650px',
                            margin: '0 auto'
                        }}>
                            CineBook is your ultimate movie booking platform — built to make discovering,
                            exploring, and booking movies effortless. From interactive seat selection to
                            real-time show timings, we bring the cinema experience to your fingertips.
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div style={{
                background: 'var(--bg-secondary)',
                borderTop: '1px solid var(--border)',
                borderBottom: '1px solid var(--border)',
                padding: '40px 0'
            }}>
                <div className="container">
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: '24px'
                    }}>
                        {stats.map((stat, index) => (
                            <div key={index} style={{
                                textAlign: 'center',
                                padding: '24px',
                                background: 'var(--bg-card)',
                                borderRadius: 'var(--radius-lg)',
                                border: '1px solid var(--border)',
                                transition: 'var(--transition)'
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    e.currentTarget.style.borderColor = 'var(--primary)';
                                    e.currentTarget.style.boxShadow = '0 8px 30px rgba(220, 38, 38, 0.15)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.borderColor = 'var(--border)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                <div style={{
                                    color: 'var(--primary)',
                                    marginBottom: '12px',
                                    display: 'flex',
                                    justifyContent: 'center'
                                }}>
                                    {stat.icon}
                                </div>
                                <div style={{
                                    fontSize: '2rem',
                                    fontWeight: '800',
                                    background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    marginBottom: '4px'
                                }}>
                                    {stat.value}
                                </div>
                                <div style={{
                                    color: 'var(--text-secondary)',
                                    fontSize: '0.9rem',
                                    fontWeight: '500'
                                }}>
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div style={{ padding: '60px 0' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                        <h2 style={{
                            fontSize: '2rem',
                            fontWeight: '800',
                            marginBottom: '12px',
                            background: 'linear-gradient(135deg, var(--text-primary), var(--text-secondary))',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            What Makes CineBook Special
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
                            Everything you need for the perfect movie experience
                        </p>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '24px'
                    }}>
                        {features.map((feature, index) => (
                            <div key={index} style={{
                                padding: '32px 24px',
                                background: 'var(--bg-card)',
                                border: '1px solid var(--border)',
                                borderRadius: 'var(--radius-lg)',
                                transition: 'var(--transition)'
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-6px)';
                                    e.currentTarget.style.borderColor = 'var(--primary)';
                                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(220, 38, 38, 0.12)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.borderColor = 'var(--border)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                <div style={{
                                    width: '64px',
                                    height: '64px',
                                    borderRadius: 'var(--radius-md)',
                                    background: 'rgba(220, 38, 38, 0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--primary)',
                                    marginBottom: '20px'
                                }}>
                                    {feature.icon}
                                </div>
                                <h3 style={{
                                    fontSize: '1.15rem',
                                    fontWeight: '700',
                                    marginBottom: '10px',
                                    color: 'var(--text-primary)'
                                }}>
                                    {feature.title}
                                </h3>
                                <p style={{
                                    color: 'var(--text-secondary)',
                                    fontSize: '0.9rem',
                                    lineHeight: '1.6'
                                }}>
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Our Values Section */}
            <div style={{
                background: 'var(--bg-secondary)',
                borderTop: '1px solid var(--border)',
                borderBottom: '1px solid var(--border)',
                padding: '60px 0'
            }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                        <h2 style={{
                            fontSize: '2rem',
                            fontWeight: '800',
                            marginBottom: '12px',
                            background: 'linear-gradient(135deg, var(--text-primary), var(--text-secondary))',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            Our Values
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
                            The principles that drive everything we do
                        </p>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '24px',
                        maxWidth: '900px',
                        margin: '0 auto'
                    }}>
                        {teamValues.map((value, index) => (
                            <div key={index} style={{
                                textAlign: 'center',
                                padding: '32px 24px',
                                background: 'var(--bg-card)',
                                border: '1px solid var(--border)',
                                borderRadius: 'var(--radius-lg)',
                                transition: 'var(--transition)'
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    e.currentTarget.style.borderColor = 'var(--primary)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.borderColor = 'var(--border)';
                                }}
                            >
                                <div style={{
                                    width: '56px',
                                    height: '56px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    margin: '0 auto 16px'
                                }}>
                                    {value.icon}
                                </div>
                                <h4 style={{
                                    fontSize: '1.1rem',
                                    fontWeight: '700',
                                    marginBottom: '8px',
                                    color: 'var(--text-primary)'
                                }}>
                                    {value.title}
                                </h4>
                                <p style={{
                                    color: 'var(--text-secondary)',
                                    fontSize: '0.9rem',
                                    lineHeight: '1.6'
                                }}>
                                    {value.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div style={{ padding: '60px 0' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                        <h2 style={{
                            fontSize: '2rem',
                            fontWeight: '800',
                            marginBottom: '12px',
                            background: 'linear-gradient(135deg, var(--text-primary), var(--text-secondary))',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            Frequently Asked Questions
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
                            Got questions? We've got answers
                        </p>
                    </div>

                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        {faqs.map((faq, index) => (
                            <div key={index} style={{
                                marginBottom: '12px',
                                background: 'var(--bg-card)',
                                border: `1px solid ${openFaq === index ? 'var(--primary)' : 'var(--border)'}`,
                                borderRadius: 'var(--radius-md)',
                                overflow: 'hidden',
                                transition: 'var(--transition)'
                            }}>
                                <button
                                    onClick={() => toggleFaq(index)}
                                    style={{
                                        width: '100%',
                                        padding: '20px 24px',
                                        background: 'transparent',
                                        border: 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        gap: '16px',
                                        cursor: 'pointer',
                                        textAlign: 'left'
                                    }}
                                >
                                    <span style={{
                                        fontSize: '1rem',
                                        fontWeight: '600',
                                        color: openFaq === index ? 'var(--primary)' : 'var(--text-primary)',
                                        transition: 'var(--transition)'
                                    }}>
                                        {faq.question}
                                    </span>
                                    <div style={{
                                        flexShrink: 0,
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '50%',
                                        background: openFaq === index ? 'var(--primary)' : 'var(--bg-secondary)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: openFaq === index ? 'white' : 'var(--text-secondary)',
                                        transition: 'var(--transition)'
                                    }}>
                                        {openFaq === index ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                    </div>
                                </button>
                                <div style={{
                                    maxHeight: openFaq === index ? '300px' : '0',
                                    overflow: 'hidden',
                                    transition: 'max-height 0.35s ease'
                                }}>
                                    <div style={{
                                        padding: '0 24px 20px',
                                        color: 'var(--text-secondary)',
                                        fontSize: '0.95rem',
                                        lineHeight: '1.7',
                                        borderTop: '1px solid var(--border)'
                                    }}>
                                        <div style={{ paddingTop: '16px' }}>
                                            {faq.answer}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Contact CTA Section */}
            <div style={{
                background: 'var(--bg-secondary)',
                borderTop: '1px solid var(--border)',
                padding: '60px 0'
            }}>
                <div className="container">
                    <div style={{
                        textAlign: 'center',
                        maxWidth: '600px',
                        margin: '0 auto'
                    }}>
                        <Headphones size={40} color="var(--primary)" style={{ marginBottom: '16px' }} />
                        <h2 style={{
                            fontSize: '1.8rem',
                            fontWeight: '800',
                            marginBottom: '12px',
                            color: 'var(--text-primary)'
                        }}>
                            Still Have Questions?
                        </h2>
                        <p style={{
                            color: 'var(--text-secondary)',
                            fontSize: '1rem',
                            lineHeight: '1.6',
                            marginBottom: '24px'
                        }}>
                            Our support team is always ready to help you with any queries.
                            Reach out to us anytime!
                        </p>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '16px',
                            flexWrap: 'wrap'
                        }}>
                            <a href="mailto:support@cinebook.com" style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '12px 28px',
                                background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                                color: 'white',
                                borderRadius: 'var(--radius-md)',
                                textDecoration: 'none',
                                fontWeight: '600',
                                fontSize: '0.95rem',
                                transition: 'var(--transition)',
                                boxShadow: '0 4px 20px rgba(220, 38, 38, 0.3)'
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(220, 38, 38, 0.4)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(220, 38, 38, 0.3)';
                                }}
                            >
                                <Smartphone size={18} />
                                Contact Support
                            </a>
                            <Link to="/" style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '12px 28px',
                                background: 'var(--bg-card)',
                                color: 'var(--text-primary)',
                                border: '1px solid var(--border)',
                                borderRadius: 'var(--radius-md)',
                                textDecoration: 'none',
                                fontWeight: '600',
                                fontSize: '0.95rem',
                                transition: 'var(--transition)'
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--primary)';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--border)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                <Film size={18} />
                                Browse Movies
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
