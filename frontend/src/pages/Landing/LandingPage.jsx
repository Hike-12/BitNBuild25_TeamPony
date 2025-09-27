import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { 
  FaSun, 
  FaMoon, 
  FaBolt, 
  FaTruck, 
  FaUsers, 
  FaStar, 
  FaChevronRight, 
  FaPlay,
  FaHeart,
  FaGem,
  FaTrophy,
  FaBullseye,
  FaGift,
  FaMapMarkerAlt,
  FaUtensils,
  FaAward,
  FaMedal,
  FaCrown
} from 'react-icons/fa';

// Add Google Fonts for premium typography
if (!document.querySelector('link[href*="Playfair+Display"]')) {
  const link = document.createElement('link');
  link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Merriweather:wght@300;400;700&display=swap';
  link.rel = 'stylesheet';
  document.head.appendChild(link);
}

const LandingPage = () => {
  const { isDarkMode, toggleTheme, theme } = useTheme();
  const [currentHero, setCurrentHero] = useState(0);
  const [gameScore, setGameScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  const testimonials = [
    {
      name: "Aarav Sharma",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      text: "NourishNet has revolutionized how I discover authentic local cuisine. The platform's sophistication and attention to detail is remarkable.",
      role: "Executive Chef & Culinary Consultant"
    },
    {
      name: "Priya Mehta",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      text: "As a vendor, NourishNet provides an elegant platform that truly understands the artistry of food. Our business has flourished.",
      role: "Owner, Spice Heritage Restaurant"
    },
    {
      name: "Rahul Khanna",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      text: "The premium experience and curated selection make every meal a sophisticated culinary journey. Absolutely exceptional.",
      role: "Food & Lifestyle Critic"
    }
  ];

  const heroTexts = [
    { title: "Curated Culinary Excellence", subtitle: "Discover artisanal flavors from the finest local establishments" },
    { title: "Sophisticated Dining Experience", subtitle: "Where exceptional taste meets unparalleled service" },
    { title: "Premium Local Gastronomy", subtitle: "Elevating neighborhood dining to extraordinary heights" }
  ];

  const gameFeatures = [
    {
      icon: <FaCrown className="w-8 h-8" />,
      title: "Elite Rewards",
      description: "Exclusive privileges and premium benefits with every curated experience",
      points: 50,
      color: theme.primary
    },
    {
      icon: <FaMedal className="w-8 h-8" />,
      title: "Culinary Achievements",
      description: "Unlock prestigious badges as you explore refined dining experiences",
      points: 25,
      color: theme.secondary
    },
    {
      icon: <FaAward className="w-8 h-8" />,
      title: "VIP Recognition",
      description: "Distinguished status and personalized recommendations for connoisseurs",
      points: 75,
      color: theme.primary
    }
  ];

  const vendors = [
    { name: "Saffron & Sage", rating: 4.9, cuisine: "Contemporary Indian", distance: "0.2 km", icon: <FaUtensils /> },
    { name: "Casa Madera", rating: 4.8, cuisine: "Artisan Mexican", distance: "0.5 km", icon: <FaUtensils /> },
    { name: "Golden Bamboo", rating: 4.7, cuisine: "Pan-Asian Fusion", distance: "0.3 km", icon: <FaUtensils /> },
    { name: "Bella Vista", rating: 4.6, cuisine: "Authentic Italian", distance: "0.7 km", icon: <FaUtensils /> }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % heroTexts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);


  // Typewriter effect hook
  function useTypewriter(text, speed = 1000) {
    const [displayed, setDisplayed] = useState("");
    useEffect(() => {
      setDisplayed("");
      let i = 0;
      const interval = setInterval(() => {
        setDisplayed((prev) => text.slice(0, i));
        i++;
        if (i > text.length) clearInterval(interval);
      }, speed);
      return () => clearInterval(interval);
    }, [text, speed]);
    return displayed;
  }

  const typeTitle = useTypewriter(heroTexts[currentHero].title, 80);
  const typeSubtitle = useTypewriter(heroTexts[currentHero].subtitle, 36);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % gameFeatures.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleFeatureClick = (index, points) => {
    setGameScore(prev => prev + points);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 4000);
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col justify-between relative"
      style={{
        fontFamily: 'Merriweather, serif',
        minHeight: '100vh',
        background: theme.background,
        position: 'relative',
      }}
    >
      {/* Premium Background Image Overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          opacity: isDarkMode ? 0.15 : 0.05,
        }}
      />
      
      {/* Elegant Gradient Overlay */}
      <div 
        className="absolute inset-0 z-1"
        style={{
          background: `linear-gradient(135deg, 
            ${isDarkMode ? 'rgba(3,3,3,0.95)' : 'rgba(253,253,247,0.95)'} 0%, 
            ${isDarkMode ? 'rgba(23,41,34,0.90)' : 'rgba(245,248,242,0.90)'} 50%, 
            ${isDarkMode ? 'rgba(3,3,3,0.95)' : 'rgba(253,253,247,0.95)'} 100%)`,
        }}
      />
      
      {/* Luxury Texture Pattern */}
      <div 
        className="absolute inset-0 z-2 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, ${theme.primary}08 0%, transparent 50%), 
                           radial-gradient(circle at 75% 75%, ${theme.secondary}06 0%, transparent 50%)`,
        }}
      />

      {/* Elegant Header */}
      <header className="w-full flex justify-between items-center px-12 py-8 relative z-10">
        <div className="flex items-center gap-3">
          <FaCrown style={{ color: theme.primary, fontSize: '28px' }} />
          <span 
            className="text-2xl font-bold" 
            style={{ 
              fontFamily: 'Playfair Display, serif', 
              color: theme.primary,
              letterSpacing: '1px'
            }}
          >
            NourishNet
          </span>
        </div>
        <button
          onClick={toggleTheme}
          className="p-4 rounded-full backdrop-blur-sm border transition-all duration-500 hover:scale-110"
          style={{
            backgroundColor: `${theme.panels}95`,
            color: theme.primary,
            border: `2px solid ${theme.primary}30`,
            boxShadow: `0 8px 32px ${theme.primary}20`,
          }}
        >
          {isDarkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
        </button>
      </header>

      {/* Luxury Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-32 px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <div 
              className="inline-flex items-center gap-3 px-8 py-3 rounded-full backdrop-blur-sm border-2 shadow-2xl"
              style={{
                backgroundColor: `${theme.primary}15`,
                borderColor: `${theme.primary}40`,
                color: theme.primary,
              }}
            >
              <FaGem className="text-lg" />
              <span className="text-sm font-semibold tracking-wider uppercase">Exclusive Culinary Experience</span>
            </div>
          </div>
          <h1
            className="mb-6 leading-tight"
            style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(3rem, 8vw, 7rem)',
              fontWeight: '700',
              color: theme.text,
              textShadow: `0 4px 20px ${theme.primary}30`,
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              minHeight: '3.5em',
            }}
          >
            {typeTitle}
            <span className="animate-pulse" style={{ color: theme.primary }}>|</span>
          </h1>
          <p 
            className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed"
            style={{ 
              color: theme.textSecondary,
              fontWeight: '300',
              letterSpacing: '0.5px',
              minHeight: '2.5em',
            }}
          >
            {typeSubtitle}
            <span className="animate-pulse" style={{ color: theme.secondary }}>|</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center mt-12">
            <Link
              to="/login"
              className="group px-12 py-5 rounded-2xl font-bold text-lg transition-all duration-500 hover:scale-105 backdrop-blur-sm border-2 flex items-center gap-3"
              style={{
                backgroundColor: theme.primary,
                borderColor: theme.primary,
                color: '#ffffff',
                boxShadow: `0 12px 40px ${theme.primary}50`,
                fontFamily: 'Playfair Display, serif',
                letterSpacing: '1px'
              }}
            >
              <span>Begin Your Journey</span>
              <FaChevronRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/vendor/login"
              className="group px-12 py-5 rounded-2xl font-bold text-lg transition-all duration-500 hover:scale-105 backdrop-blur-sm border-2 flex items-center gap-3"
              style={{
                borderColor: theme.secondary,
                color: theme.secondary,
                backgroundColor: `${theme.secondary}10`,
                fontFamily: 'Playfair Display, serif',
                letterSpacing: '1px'
              }}
            >
              <span>Partner With Us</span>
              <FaTruck className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 relative z-10" style={{ backgroundColor: `${theme.panels}90` }}>
        <div className="max-w-6xl mx-auto">
          <h2 
            className="text-4xl md:text-5xl font-bold mb-8 text-center" 
            style={{ 
              color: theme.text,
              fontFamily: 'Playfair Display, serif',
              letterSpacing: '-1px'
            }}
          >
            Distinguished Features
          </h2>
          <p 
            className="text-xl text-center mb-16 max-w-3xl mx-auto"
            style={{ color: theme.textSecondary }}
          >
            Experience luxury in every interaction with our carefully crafted platform
          </p>
          <div className="grid md:grid-cols-3 gap-10">
            {gameFeatures.map((feature, index) => (
              <div
                key={feature.title}
                className={`relative p-10 rounded-3xl border-2 shadow-2xl transition-all duration-500 hover:scale-105 cursor-pointer backdrop-blur-sm ${
                  activeFeature === index ? 'shadow-2xl' : 'hover:shadow-xl'
                }`}
                style={{
                  backgroundColor: `${theme.background}95`,
                  borderColor: activeFeature === index ? feature.color : `${theme.border}50`,
                  boxShadow: activeFeature === index ? `0 25px 70px ${feature.color}30` : `0 10px 40px ${theme.primary}15`
                }}
                onClick={() => handleFeatureClick(index, feature.points)}
              >
                {activeFeature === index && (
                  <div 
                    className="absolute -top-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center animate-pulse"
                    style={{ backgroundColor: feature.color }}
                  >
                    <FaGem size={18} color="white" />
                  </div>
                )}
                
                <div 
                  className="w-20 h-20 rounded-3xl flex items-center justify-center mb-8 mx-auto"
                  style={{ 
                    backgroundColor: `${feature.color}20`,
                    color: feature.color
                  }}
                >
                  {feature.icon}
                </div>
                
                <h3 
                  className="text-2xl font-bold text-center mb-4"
                  style={{ 
                    color: theme.text,
                    fontFamily: 'Playfair Display, serif'
                  }}
                >
                  {feature.title}
                </h3>
                
                <p 
                  className="text-center mb-6 leading-relaxed"
                  style={{ color: theme.textSecondary }}
                >
                  {feature.description}
                </p>
                
                <div 
                  className="text-center font-bold text-lg px-6 py-3 rounded-full mx-auto inline-block"
                  style={{ 
                    backgroundColor: `${feature.color}20`,
                    color: feature.color,
                    border: `1px solid ${feature.color}30`
                  }}
                >
                  +{feature.points} points
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Vendors Section */}
      <section className="py-20 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <h2 
            className="text-4xl md:text-5xl font-bold mb-8 text-center" 
            style={{ 
              color: theme.text,
              fontFamily: 'Playfair Display, serif'
            }}
          >
            Curated Partners
          </h2>
          <p 
            className="text-xl text-center mb-16 max-w-3xl mx-auto"
            style={{ color: theme.textSecondary }}
          >
            Handpicked establishments that share our commitment to excellence
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {vendors.map((vendor, index) => (
              <div
                key={vendor.name}
                className="p-8 rounded-3xl border shadow-2xl transition-all duration-500 hover:scale-105 cursor-pointer backdrop-blur-sm"
                style={{
                  backgroundColor: `${theme.panels}90`,
                  borderColor: `${theme.primary}30`,
                  boxShadow: `0 15px 50px ${theme.primary}20`
                }}
                onClick={() => handleFeatureClick(index, 10)}
              >
                <div className="text-4xl mb-4 flex justify-center" style={{ color: theme.primary }}>
                  {vendor.icon}
                </div>
                <h3 
                  style={{ color: theme.text }} 
                  className="font-bold text-lg mb-2 text-center"
                >
                  {vendor.name}
                </h3>
                <p style={{ color: theme.textSecondary }} className="text-sm mb-3 text-center italic">
                  {vendor.cuisine}
                </p>
                <div className="flex items-center justify-center gap-1 text-sm mb-2">
                  <FaStar style={{ color: theme.primary }} />
                  <span style={{ color: theme.textSecondary }}>{vendor.rating}</span>
                </div>
                <div style={{ color: theme.textSecondary }} className="text-sm text-center">
                  <FaMapMarkerAlt className="inline mr-1" />
                  {vendor.distance}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 relative z-10" style={{ backgroundColor: `${theme.panels}90` }}>
        <div className="max-w-6xl mx-auto">
          <h2 
            className="text-4xl md:text-5xl font-bold mb-8 text-center" 
            style={{ 
              color: theme.text,
              fontFamily: 'Playfair Display, serif'
            }}
          >
            Our Excellence
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '10K+', label: 'Distinguished Members', icon: <FaUsers /> },
              { number: '500+', label: 'Premium Partners', icon: <FaCrown /> },
              { number: '50K+', label: 'Curated Experiences', icon: <FaAward /> },
              { number: '4.9', label: 'Excellence Rating', icon: <FaStar /> }
            ].map((stat, index) => (
              <div 
                key={stat.label} 
                className="text-center p-10 rounded-3xl border shadow-2xl backdrop-blur-sm hover:scale-105 transition-all duration-500 cursor-pointer" 
                style={{ 
                  borderColor: `${theme.primary}30`, 
                  backgroundColor: `${theme.background}90`, 
                  boxShadow: `0 15px 50px ${theme.primary}20` 
                }} 
                onClick={() => handleFeatureClick(index, 5)}
              >
                <div className="text-4xl mb-6" style={{ color: theme.primary }}>
                  {stat.icon}
                </div>
                <div 
                  className="text-4xl font-bold mb-3" 
                  style={{ 
                    color: theme.primary,
                    fontFamily: 'Playfair Display, serif'
                  }}
                >
                  {stat.number}
                </div>
                <div 
                  className="font-medium" 
                  style={{ color: theme.textSecondary }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <h2 
            className="text-4xl md:text-5xl font-bold mb-8 text-center" 
            style={{ 
              color: theme.text,
              fontFamily: 'Playfair Display, serif'
            }}
          >
            Distinguished Voices
          </h2>
          <p 
            className="text-xl text-center mb-16 max-w-3xl mx-auto"
            style={{ color: theme.textSecondary }}
          >
            Testimonials from culinary experts and discerning patrons
          </p>
          <div className="grid md:grid-cols-3 gap-10">
            {testimonials.map((testimonial, idx) => (
              <div 
                key={testimonial.name} 
                className="p-10 rounded-3xl border shadow-2xl flex flex-col items-center text-center backdrop-blur-sm" 
                style={{ 
                  borderColor: `${theme.primary}30`, 
                  backgroundColor: `${theme.panels}90`,
                  boxShadow: `0 20px 60px ${theme.primary}15`
                }}
              >
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name} 
                  className="w-20 h-20 rounded-full mb-6 shadow-lg object-cover" 
                  style={{ border: `3px solid ${theme.primary}` }} 
                />
                <p 
                  className="mb-6 text-base leading-relaxed italic" 
                  style={{ color: theme.textSecondary }}
                >
                  "{testimonial.text}"
                </p>
                <div 
                  className="font-bold text-xl mb-2" 
                  style={{ 
                    color: theme.primary,
                    fontFamily: 'Playfair Display, serif'
                  }}
                >
                  {testimonial.name}
                </div>
                <div 
                  className="text-sm font-medium" 
                  style={{ color: theme.textSecondary }}
                >
                  {testimonial.role}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 px-6 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <h2 
            className="text-4xl md:text-5xl font-bold mb-8" 
            style={{ 
              color: theme.text,
              fontFamily: 'Playfair Display, serif'
            }}
          >
            Embark on Excellence
          </h2>
          <p 
            className="text-xl mb-16 max-w-3xl mx-auto leading-relaxed" 
            style={{ color: theme.textSecondary }}
          >
            Join our exclusive community and elevate your culinary journey to extraordinary heights
          </p>
          <div className="flex flex-col sm:flex-row gap-8 justify-center">
            <Link
              to="/login"
              className="group px-12 py-6 rounded-2xl font-bold text-xl transition-all duration-500 hover:scale-110 backdrop-blur-sm border-2 flex items-center justify-center gap-3"
              style={{
                backgroundColor: theme.primary,
                borderColor: theme.primary,
                color: 'white',
                boxShadow: `0 12px 50px ${theme.primary}50`,
                fontFamily: 'Playfair Display, serif',
                letterSpacing: '1px'
              }}
            >
              <FaBolt />
              <span>Experience Excellence</span>
            </Link>
            <Link
              to="/vendor/login"
              className="group px-12 py-6 rounded-2xl font-bold text-xl transition-all duration-500 hover:scale-110 backdrop-blur-sm border-2 flex items-center justify-center gap-3"
              style={{
                borderColor: theme.secondary,
                color: theme.secondary,
                backgroundColor: `${theme.secondary}15`,
                fontFamily: 'Playfair Display, serif',
                letterSpacing: '1px'
              }}
            >
              <FaCrown />
              <span>Join Our Elite</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Elegant Footer */}
      <footer className="w-full py-12 px-6 text-center relative z-10" style={{ backgroundColor: `${theme.panels}95` }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <FaCrown style={{ color: theme.primary, fontSize: '24px' }} />
            <span 
              style={{ 
                color: theme.textSecondary,
                fontFamily: 'Playfair Display, serif'
              }} 
              className="text-sm"
            >
              &copy; {new Date().getFullYear()} NourishNet. Crafted with excellence.
            </span>
          </div>
          <div className="flex gap-8 justify-center md:justify-end">
            <a 
              href="#" 
              style={{ color: theme.primary }} 
              className="hover:underline transition-all duration-300 text-sm font-medium"
            >
              Instagram
            </a>
            <a 
              href="#" 
              style={{ color: theme.primary }} 
              className="hover:underline transition-all duration-300 text-sm font-medium"
            >
              Twitter
            </a>
            <a 
              href="#" 
              style={{ color: theme.primary }} 
              className="hover:underline transition-all duration-300 text-sm font-medium"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </footer>

      {/* Premium Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(40)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                color: i % 2 === 0 ? theme.primary : theme.secondary,
                fontSize: Math.random() * 16 + 12,
                animationDelay: Math.random() * 2 + 's',
              }}
            >
              <FaGem />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LandingPage;