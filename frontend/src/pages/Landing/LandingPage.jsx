import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import Carousel3D from '../../components/Carousel3D';
import Footer from '../../components/Footer';
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
  FaCrown,
  FaChevronLeft,
  FaClock,
  FaPhone
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

      {/* Restaurant Carousel Section */}
      <section className="py-10 px-4 relative z-10" style={{ backgroundColor: `${theme.panels}98` }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center" style={{ color: theme.text, fontFamily: 'Playfair Display, serif' }}>
            Featured Restaurants
          </h2>
          <p className="text-base text-center mb-8 max-w-2xl mx-auto" style={{ color: theme.textSecondary }}>
            Discover exceptional dining experiences from our premium restaurant partners
          </p>
          {/* Compact Restaurant Carousel */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                id: 1,
                name: "Le Jardin Royal",
                cuisine: "Fine French Cuisine",
                rating: 4.9,
                reviews: 342,
                image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop",
                description: "Exquisite French culinary artistry in an elegant setting",
                price: "$$$",
                time: "45-60 min"
              },
              {
                id: 2,
                name: "Sakura Premium",
                cuisine: "Authentic Japanese",
                rating: 4.8,
                reviews: 289,
                image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=600&h=400&fit=crop",
                description: "Traditional Japanese flavors with modern presentation",
                price: "$$$",
                time: "35-50 min"
              },
              {
                id: 3,
                name: "Villa Mediterranea",
                cuisine: "Italian Fine Dining",
                rating: 4.9,
                reviews: 456,
                image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop",
                description: "Authentic Italian cuisine with premium ingredients",
                price: "$$$$",
                time: "40-55 min"
              },
              {
                id: 4,
                name: "Golden Spice",
                cuisine: "Contemporary Indian",
                rating: 4.7,
                reviews: 198,
                image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&h=400&fit=crop",
                description: "Modern Indian cuisine with aromatic spices",
                price: "$$",
                time: "30-45 min"
              },
              {
                id: 5,
                name: "Ocean's Bounty",
                cuisine: "Fresh Seafood",
                rating: 4.8,
                reviews: 367,
                image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop",
                description: "Daily fresh catch prepared to perfection",
                price: "$$$",
                time: "25-40 min"
              },
              {
                id: 6,
                name: "The Steakhouse",
                cuisine: "Premium Steaks",
                rating: 4.9,
                reviews: 523,
                image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&h=400&fit=crop",
                description: "Premium cuts grilled to perfection",
                price: "$$$$",
                time: "50-65 min"
              }
            ].map((restaurant) => (
              <div 
                key={restaurant.id} 
                className="group relative overflow-hidden rounded-2xl shadow-2xl transition-all duration-500 hover:scale-105 cursor-pointer backdrop-blur-sm border"
                style={{ 
                  backgroundColor: `${theme.panels}95`,
                  borderColor: `${theme.primary}20`,
                  boxShadow: `0 20px 60px ${theme.primary}15`
                }}
              >
                {/* Restaurant Image */}
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={restaurant.image} 
                    alt={restaurant.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Price Badge */}
                  <div className="absolute top-4 right-4">
                    <span 
                      className="px-3 py-1 rounded-full text-sm font-bold text-white backdrop-blur-sm"
                      style={{ backgroundColor: `${theme.primary}90` }}
                    >
                      {restaurant.price}
                    </span>
                  </div>
                  
                  {/* Rating Badge */}
                  <div className="absolute top-4 left-4 flex items-center gap-1 px-3 py-1 rounded-full backdrop-blur-md" style={{ backgroundColor: `${theme.background}90` }}>
                    <FaStar style={{ color: '#FFD700' }} className="text-sm" />
                    <span className="text-sm font-bold" style={{ color: theme.text }}>{restaurant.rating}</span>
                  </div>
                </div>
                
                {/* Restaurant Details */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 
                        className="text-xl font-bold mb-1"
                        style={{ 
                          color: theme.text,
                          fontFamily: 'Playfair Display, serif'
                        }}
                      >
                        {restaurant.name}
                      </h3>
                      <p className="text-sm font-medium" style={{ color: theme.primary }}>
                        {restaurant.cuisine}
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-sm mb-4 leading-relaxed" style={{ color: theme.textSecondary }}>
                    {restaurant.description}
                  </p>
                  
                  {/* Bottom Info */}
                  <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: `${theme.primary}20` }}>
                    <div className="flex items-center gap-1 text-sm" style={{ color: theme.textSecondary }}>
                      <FaClock className="text-xs" />
                      <span>{restaurant.time}</span>
                    </div>
                    <div className="text-xs" style={{ color: theme.textSecondary }}>
                      {restaurant.reviews} reviews
                    </div>
                  </div>
                </div>
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-transparent group-hover:from-black/20 group-hover:via-transparent group-hover:to-transparent transition-all duration-500 opacity-0 group-hover:opacity-100 flex items-center justify-center">
                  <button 
                    className="px-6 py-2 rounded-full font-semibold text-white backdrop-blur-sm transform translate-y-4 group-hover:translate-y-0 transition-all duration-500"
                    style={{ backgroundColor: `${theme.primary}90` }}
                  >
                    View Menu
                  </button>
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
                className="text-center p-6 rounded-xl border shadow-md bg-white" 
                style={{ borderColor: `${theme.primary}20` }}
              >
                <div className="text-2xl mb-3" style={{ color: theme.primary }}>
                  {stat.icon}
                </div>
                <div className="text-xl font-bold mb-1" style={{ color: theme.primary, fontFamily: 'Playfair Display, serif' }}>
                  {stat.number}
                </div>
                <div className="font-medium text-xs" style={{ color: theme.textSecondary }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-10 px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center" style={{ color: theme.text, fontFamily: 'Playfair Display, serif' }}>
            Distinguished Voices
          </h2>
          <p className="text-base text-center mb-8 max-w-2xl mx-auto" style={{ color: theme.textSecondary }}>
            Testimonials from culinary experts and discerning patrons
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, idx) => (
              <div key={testimonial.name} className="p-6 rounded-xl border shadow-md flex flex-col items-center text-center bg-white" style={{ borderColor: `${theme.primary}20` }}>
                <img src={testimonial.avatar} alt={testimonial.name} className="w-14 h-14 rounded-full mb-4 shadow-sm object-cover" style={{ border: `2px solid ${theme.primary}` }} />
                <p className="mb-4 text-sm leading-relaxed italic" style={{ color: theme.textSecondary }}>
                  "{testimonial.text}"
                </p>
                <div className="font-bold text-base mb-1" style={{ color: theme.primary, fontFamily: 'Playfair Display, serif' }}>
                  {testimonial.name}
                </div>
                <div className="text-xs font-medium" style={{ color: theme.textSecondary }}>
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

      {/* Premium Footer */}
      <Footer />

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