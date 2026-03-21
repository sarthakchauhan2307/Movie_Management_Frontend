import React from 'react';
import { Link } from 'react-router-dom';
import {
    Film,
    MapPin,
    Phone,
    Mail,
    Facebook,
    Twitter,
    Instagram,
    Youtube,
    Heart,
    ExternalLink
} from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="site-footer">
            <div className="container">
                <div className="footer-main">
                    {/* Brand Column */}
                    <div className="footer-brand">
                        <Link to="/" style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            textDecoration: 'none',
                            marginBottom: '4px'
                        }}>
                            <div style={{
                                background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                                padding: '10px',
                                borderRadius: 'var(--radius-md)',
                                display: 'flex'
                            }}>
                                <Film size={24} color="white" />
                            </div>
                            <span style={{
                                fontSize: '1.5rem',
                                fontWeight: 800,
                                background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                letterSpacing: '-0.5px'
                            }}>
                                CineBook
                            </span>
                        </Link>
                        <p>
                            Your ultimate destination for movie bookings.
                            Experience cinema like never before with seamless
                            booking, exclusive offers, and the best seats in town.
                        </p>

                        {/* Social Media */}
                        <div className="footer-social">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" title="Facebook">
                                <Facebook size={18} />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" title="Twitter">
                                <Twitter size={18} />
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" title="Instagram">
                                <Instagram size={18} />
                            </a>
                            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" title="YouTube">
                                <Youtube size={18} />
                            </a>
                        </div>

                        {/* Contact Info */}
                        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                                <Phone size={14} color="var(--primary)" />
                                <span>+91 1800-123-4567</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                                <Mail size={14} color="var(--primary)" />
                                <span>support@cinebook.com</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                                <MapPin size={14} color="var(--primary)" />
                                <span>Mumbai, Maharashtra, India</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-column">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/my-bookings">My Bookings</Link></li>
                            <li><Link to="/collections">Box Office Collection</Link></li>
                            <li><Link to="/profile">My Profile</Link></li>
                            <li><Link to="/">Offers & Promotions</Link></li>
                            <li><Link to="/">Gift Cards</Link></li>
                            <li><Link to="/">Corporate Bookings</Link></li>
                        </ul>
                    </div>

                    {/* Movies */}
                    <div className="footer-column">
                        <h4>Movies</h4>
                        <ul>
                            <li><Link to="/">Now Showing</Link></li>
                            <li><Link to="/">Coming Soon</Link></li>
                            <li><Link to="/">Top Rated</Link></li>
                            <li><Link to="/">New Releases</Link></li>
                            <li><Link to="/movies">Movies in Hindi</Link></li>
                            <li><Link to="/movies">Movies in English</Link></li>
                            <li><Link to="/movies">Movies in Telugu</Link></li>
                        </ul>
                    </div>

                    {/* Help & Support */}
                    <div className="footer-column">
                        <h4>Help & Support</h4>
                        <ul>
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/about">Contact Us</Link></li>
                            <li><Link to="/about">FAQs</Link></li>
                            <li><Link to="/about">Terms & Conditions</Link></li>
                            <li><Link to="/about">Privacy Policy</Link></li>
                            <li><Link to="/about">Refund Policy</Link></li>
                            <li><Link to="/about">Sitemap <ExternalLink size={12} /></Link></li>
                        </ul>
                    </div>
                </div>

                {/* Divider */}
                <div className="footer-divider" />

                {/* Bottom Bar */}
                <div className="footer-bottom">
                    <p>
                        © {currentYear} CineBook. All rights reserved. Made with{' '}
                        <Heart size={12} fill="var(--primary)" color="var(--primary)" style={{ verticalAlign: 'middle' }} />{' '}
                        in India.
                    </p>
                    <div className="footer-bottom-links">
                        <Link to="/about">Privacy Policy</Link>
                        <Link to="/about">Terms of Use</Link>
                        <Link to="/about">Cookie Policy</Link>
                        <Link to="/about">Disclaimer</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
