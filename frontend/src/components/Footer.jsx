import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { FaCrown, FaInstagram, FaTwitter, FaLinkedin, FaFacebook, FaYoutube, FaPhone, FaEnvelope, FaMapMarkerAlt, FaHeart } from 'react-icons/fa';

const Footer = ({ variant = 'default' }) => {
  const { theme } = useTheme();

  // Simple footer for forms and auth pages
  if (variant === 'simple') {
    return (
      <footer className="w-full py-6 px-6 text-center relative z-10 border-t" 
        style={{ 
          backgroundColor: theme.panels,
          borderColor: theme.border
        }}
      >
        <div className="flex items-center justify-center gap-3">
          <FaCrown style={{ color: theme.primary, fontSize: '20px' }} />
          <span 
            style={{ 
              color: theme.textSecondary,
              fontFamily: 'Playfair Display, serif'
            }} 
            className="text-sm font-medium"
          >
            &copy; {new Date().getFullYear()} NourishNet. Crafted with excellence.
          </span>
        </div>
      </footer>
    );
  }

  // Full premium footer for main pages
  return (
    <footer className="w-full relative z-10" 
      style={{ 
        backgroundColor: theme.panels,
        borderTop: `2px solid ${theme.primary}20`
      }}
    >
      {/* Decorative top border */}
      <div 
        className="w-full h-1"
        style={{
          background: `linear-gradient(90deg, ${theme.primary}00 0%, ${theme.primary} 50%, ${theme.primary}00 100%)`
        }}
      />
      
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <FaCrown style={{ color: theme.primary, fontSize: '28px' }} />
              <h3 
                style={{ 
                  color: theme.text,
                  fontFamily: 'Playfair Display, serif'
                }}
                className="text-xl font-bold"
              >
                NourishNet
              </h3>
            </div>
            <p 
              style={{ color: theme.textSecondary }}
              className="text-sm leading-relaxed mb-6"
            >
              Delivering premium tiffin services with the perfect blend of nutrition, taste, and convenience. 
              Crafted with love for the modern lifestyle.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-4">
              {[
                { icon: FaInstagram, href: '#', label: 'Instagram' },
                { icon: FaFacebook, href: '#', label: 'Facebook' },
                { icon: FaTwitter, href: '#', label: 'Twitter' },
                { icon: FaLinkedin, href: '#', label: 'LinkedIn' },
                { icon: FaYoutube, href: '#', label: 'YouTube' }
              ].map(({ icon: Icon, href, label }, index) => (
                <a
                  key={index}
                  href={href}
                  aria-label={label}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                  style={{
                    backgroundColor: `${theme.primary}15`,
                    color: theme.primary,
                    border: `1px solid ${theme.primary}30`
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = theme.primary;
                    e.target.style.color = theme.background;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = `${theme.primary}15`;
                    e.target.style.color = theme.primary;
                  }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 
              style={{ color: theme.text }}
              className="text-lg font-semibold mb-4"
            >
              Quick Links
            </h4>
            <ul className="space-y-2">
              {[
                { label: 'Home', href: '/' },
                { label: 'Menu', href: '/menu' },
                { label: 'Subscriptions', href: '/subscriptions' },
                { label: 'About Us', href: '/about' },
                { label: 'Contact', href: '/contact' }
              ].map(({ label, href }, index) => (
                <li key={index}>
                  <a
                    href={href}
                    style={{ color: theme.textSecondary }}
                    className="text-sm hover:underline transition-all duration-300 hover:translate-x-1 inline-block"
                    onMouseEnter={(e) => e.target.style.color = theme.primary}
                    onMouseLeave={(e) => e.target.style.color = theme.textSecondary}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* For Vendors */}
          <div>
            <h4 
              style={{ color: theme.text }}
              className="text-lg font-semibold mb-4"
            >
              For Vendors
            </h4>
            <ul className="space-y-2">
              {[
                { label: 'Vendor Login', href: '/vendor/login' },
                { label: 'Partner with Us', href: '/vendor/signup' },
                { label: 'Vendor Dashboard', href: '/vendor/dashboard' },
                { label: 'Menu Management', href: '/vendor/menu' },
                { label: 'Support', href: '/vendor/support' }
              ].map(({ label, href }, index) => (
                <li key={index}>
                  <a
                    href={href}
                    style={{ color: theme.textSecondary }}
                    className="text-sm hover:underline transition-all duration-300 hover:translate-x-1 inline-block"
                    onMouseEnter={(e) => e.target.style.color = theme.primary}
                    onMouseLeave={(e) => e.target.style.color = theme.textSecondary}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 
              style={{ color: theme.text }}
              className="text-lg font-semibold mb-4"
            >
              Get in Touch
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <FaPhone 
                  style={{ color: theme.primary }} 
                  className="text-sm flex-shrink-0" 
                />
                <span 
                  style={{ color: theme.textSecondary }}
                  className="text-sm"
                >
                  +91 98765 43210
                </span>
              </div>
              <div className="flex items-center gap-3">
                <FaEnvelope 
                  style={{ color: theme.primary }} 
                  className="text-sm flex-shrink-0" 
                />
                <span 
                  style={{ color: theme.textSecondary }}
                  className="text-sm"
                >
                  hello@nourishnet.com
                </span>
              </div>
              <div className="flex items-start gap-3">
                <FaMapMarkerAlt 
                  style={{ color: theme.primary }} 
                  className="text-sm flex-shrink-0 mt-0.5" 
                />
                <span 
                  style={{ color: theme.textSecondary }}
                  className="text-sm leading-relaxed"
                >
                  123 Food Street, Gourmet District, Mumbai 400001
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-12 pt-8 border-t" style={{ borderColor: theme.border }}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span 
                style={{ color: theme.textSecondary }}
                className="text-sm"
              >
                Made with
              </span>
              <FaHeart 
                style={{ color: theme.primary }} 
                className="text-sm animate-pulse" 
              />
              <span 
                style={{ color: theme.textSecondary }}
                className="text-sm"
              >
                in India
              </span>
            </div>
            
            <div className="text-center">
              <span 
                style={{ 
                  color: theme.textSecondary,
                  fontFamily: 'Playfair Display, serif'
                }} 
                className="text-sm font-medium"
              >
                &copy; {new Date().getFullYear()} NourishNet. All rights reserved.
              </span>
            </div>

            <div className="flex gap-6 text-xs">
              <a
                href="/privacy"
                style={{ color: theme.textSecondary }}
                className="hover:underline transition-colors duration-300"
                onMouseEnter={(e) => e.target.style.color = theme.primary}
                onMouseLeave={(e) => e.target.style.color = theme.textSecondary}
              >
                Privacy Policy
              </a>
              <a
                href="/terms"
                style={{ color: theme.textSecondary }}
                className="hover:underline transition-colors duration-300"
                onMouseEnter={(e) => e.target.style.color = theme.primary}
                onMouseLeave={(e) => e.target.style.color = theme.textSecondary}
              >
                Terms & Conditions
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle bottom gradient */}
      <div 
        className="w-full h-2"
        style={{
          background: `linear-gradient(180deg, transparent 0%, ${theme.primary}05 100%)`
        }}
      />
    </footer>
  );
};

export default Footer;