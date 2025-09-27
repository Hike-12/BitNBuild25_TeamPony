import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import Carousel3D from '../../components/Carousel3D';
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





const RestaurantCarousel = ({ theme }) => {
  const [current, setCurrent] = useState(0);

  const restaurants = [
    {
      title: "Le Jardin Royal",
      cuisine: "Fine French Cuisine",
      description: "Exquisite French culinary artistry in an elegant setting with premium ingredients",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=3387&auto=format&fit=crop",
      rating: 4.9,
      price: "$$$",
      time: "45-60 min"
    },
    {
      title: "Sakura Premium",
      cuisine: "Authentic Japanese",
      description: "Traditional Japanese flavors with modern presentation and fresh seasonal ingredients",
      image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?q=80&w=3456&auto=format&fit=crop",
      rating: 4.8,
      price: "$$$",
      time: "35-50 min"
    },
    {
      title: "Villa Mediterranea", 
      cuisine: "Italian Fine Dining",
      description: "Authentic Italian cuisine with imported ingredients and traditional family recipes",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?q=80&w=3540&auto=format&fit=crop",
      rating: 4.9,
      price: "$$$$",
      time: "40-55 min"
    },
    {
      title: "Golden Spice",
      cuisine: "Contemporary Indian", 
      description: "Modern Indian cuisine with aromatic spices and innovative cooking techniques",
      image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=3387&auto=format&fit=crop",
      rating: 4.7,
      price: "$$",
      time: "30-45 min"
    },
    {
      title: "Ocean's Bounty",
      cuisine: "Fresh Seafood",
      description: "Daily fresh catch prepared to perfection with coastal spices and Mediterranean influences",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=3456&auto=format&fit=crop",
      rating: 4.8,
      price: "$$$",
      time: "25-40 min"
    }
  ];

  const handleSlideClick = (index) => {
    setCurrent(index);
  };

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % restaurants.length);
  };

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + restaurants.length) % restaurants.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-6xl mx-auto">
      {/* Main Carousel Container */}
      <div className="relative h-[340px] overflow-hidden rounded-3xl shadow-2xl">
        {/* Active Slide */}
        <div 
          className="relative w-full h-full transition-all duration-700 ease-in-out"
          style={{
            backgroundImage: `url(${restaurants[current].image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Premium Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          {/* Content */}
          <div className="relative z-10 h-full flex items-center">
            <div className="max-w-xl p-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <span 
                  className="px-4 py-2 rounded-full text-sm font-bold backdrop-blur-sm"
                  style={{ backgroundColor: `${theme.primary}90` }}
                >
                  {restaurants[current].cuisine}
                </span>
                <div className="flex items-center gap-1">
                  <FaStar className="text-yellow-400" />
                  <span className="font-bold">{restaurants[current].rating}</span>
                </div>
              </div>
              <h3 
                className="text-2xl md:text-3xl font-bold mb-3 leading-tight"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                {restaurants[current].title}
              </h3>
              <p className="text-base mb-4 text-gray-200 leading-relaxed">
                {restaurants[current].description}
              </p>
              <div className="flex items-center gap-8 mb-8 text-gray-300">
                <div className="flex items-center gap-2">
                  <FaClock />
                  <span>{restaurants[current].time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaUtensils />
                  <span>{restaurants[current].price}</span>
                </div>
              </div>
              <button 
                className="group px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-500 hover:scale-105 backdrop-blur-sm border-2 flex items-center gap-3"
                style={{
                  backgroundColor: theme.primary,
                  borderColor: theme.primary,
                  color: 'white',
                  boxShadow: `0 12px 40px ${theme.primary}60`,
                  fontFamily: 'Playfair Display, serif'
                }}
              >
                <span>Explore Menu</span>
                <FaChevronRight className="group-hover:translate-x-1 transition-transform text-sm" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-14 h-14 rounded-full backdrop-blur-md border-2 transition-all duration-300 hover:scale-110 z-20"
        style={{
          backgroundColor: `${theme.background}90`,
          borderColor: theme.primary,
          color: theme.primary,
        }}
      >
        <FaChevronLeft className="w-5 h-5 mx-auto" />
      </button>
      
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 w-14 h-14 rounded-full backdrop-blur-md border-2 transition-all duration-300 hover:scale-110 z-20"
        style={{
          backgroundColor: `${theme.background}90`,
          borderColor: theme.primary,
          color: theme.primary,
        }}
      >
        <FaChevronRight className="w-5 h-5 mx-auto" />
      </button>

      {/* Elegant Progress Indicators */}
      <div className="flex justify-center gap-3 mt-8">
        {restaurants.map((_, index) => (
          <button
            key={index}
            onClick={() => handleSlideClick(index)}
            className={`transition-all duration-500 hover:scale-110 ${
              index === current 
                ? 'w-12 h-3 rounded-full' 
                : 'w-3 h-3 rounded-full opacity-40 hover:opacity-70'
            }`}
            style={{
              backgroundColor: index === current ? theme.primary : theme.textSecondary,
              boxShadow: index === current ? `0 4px 20px ${theme.primary}40` : 'none',
            }}
          />
        ))}
      </div>
    </div>
  );
};

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
      <section className="flex flex-col items-center justify-center text-center py-12 px-4 relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="mb-4">
            <div 
              className="inline-flex items-center gap-2 px-6 py-2 rounded-full backdrop-blur-sm border shadow"
              style={{
                backgroundColor: `${theme.primary}10`,
                borderColor: `${theme.primary}30`,
                color: theme.primary,
              }}
            >
              <FaGem className="text-base" />
              <span className="text-xs font-semibold tracking-wide uppercase">Exclusive Culinary Experience</span>
            </div>
          </div>
          <h1
            className="mb-4 leading-tight"
            style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(2rem, 6vw, 3.5rem)',
              fontWeight: '700',
              color: theme.text,
              textShadow: `0 2px 10px ${theme.primary}20`,
              letterSpacing: '-0.01em',
              lineHeight: 1.1,
              minHeight: '2.5em',
            }}
          >
            {typeTitle}
            <span className="animate-pulse" style={{ color: theme.primary }}>|</span>
          </h1>
          <p 
            className="text-base md:text-lg mb-6 max-w-xl mx-auto leading-relaxed"
            style={{ 
              color: theme.textSecondary,
              fontWeight: '300',
              letterSpacing: '0.5px',
              minHeight: '1.5em',
            }}
          >
            {typeSubtitle}
            <span className="animate-pulse" style={{ color: theme.secondary }}>|</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-6">
            <Link
              to="/login"
              className="group px-8 py-3 rounded-xl font-bold text-base transition-all duration-500 hover:scale-105 backdrop-blur-sm border flex items-center gap-2"
              style={{
                backgroundColor: theme.primary,
                borderColor: theme.primary,
                color: '#ffffff',
                boxShadow: `0 6px 20px ${theme.primary}30`,
                fontFamily: 'Playfair Display, serif',
                letterSpacing: '1px'
              }}
            >
              <span>Begin Your Journey</span>
              <FaChevronRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/vendor/login"
              className="group px-8 py-3 rounded-xl font-bold text-base transition-all duration-500 hover:scale-105 backdrop-blur-sm border flex items-center gap-2"
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
      <div className="w-32 mx-auto border-b-2 my-4" style={{ borderColor: `${theme.primary}30` }} />

      {/* Features Section */}
      <section className="py-8 px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <h2 
            className="text-xl md:text-2xl font-bold mb-4 text-center" 
            style={{ color: theme.text, fontFamily: 'Playfair Display, serif', letterSpacing: '-1px' }}
          >
            Distinguished Features
          </h2>
          <p 
            className="text-base text-center mb-8 max-w-2xl mx-auto"
            style={{ color: theme.textSecondary }}
          >
            Experience luxury in every interaction with our carefully crafted platform
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {gameFeatures.map((feature, index) => (
              <div
                key={feature.title}
                className={`relative p-6 rounded-xl border shadow-md transition-all duration-500 hover:scale-105 cursor-pointer backdrop-blur-sm ${activeFeature === index ? 'shadow-lg' : 'hover:shadow-md'}`}
                style={{
                  backgroundColor: `${theme.background}95`,
                  borderColor: activeFeature === index ? feature.color : `${theme.border}30`,
                  boxShadow: activeFeature === index ? `0 10px 30px ${feature.color}20` : `0 4px 16px ${theme.primary}10`
                }}
                onClick={() => handleFeatureClick(index, feature.points)}
              >
                {activeFeature === index && (
                  <div 
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center animate-pulse"
                    style={{ backgroundColor: feature.color }}
                  >
                    <FaGem size={14} color="white" />
                  </div>
                )}
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 mx-auto"
                  style={{ backgroundColor: `${feature.color}15`, color: feature.color }}
                >
                  {feature.icon}
                </div>
                <h3 
                  className="text-lg font-bold text-center mb-2"
                  style={{ color: theme.text, fontFamily: 'Playfair Display, serif' }}
                >
                  {feature.title}
                </h3>
                <p className="text-center mb-3 leading-relaxed text-sm" style={{ color: theme.textSecondary }}>
                  {feature.description}
                </p>
                <div className="text-center font-bold text-base px-4 py-2 rounded-full mx-auto inline-block" style={{ backgroundColor: `${feature.color}10`, color: feature.color, border: `1px solid ${feature.color}20` }}>
                  +{feature.points} points
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div className="w-32 mx-auto border-b-2 my-4" style={{ borderColor: `${theme.primary}30` }} />

      {/* Restaurant Carousel Section */}
      <section className="py-8 px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
            <h2 className="text-xl md:text-2xl font-bold mb-4 text-center" style={{ color: theme.text, fontFamily: 'Playfair Display, serif' }}>
              Featured Restaurants
            </h2>
            <p className="text-base text-center mb-8 max-w-2xl mx-auto" style={{ color: theme.textSecondary }}>
              Discover exceptional dining experiences from our premium restaurant partners
            </p>
            <RestaurantCarousel theme={theme} />
        </div>
      </section>
      <div className="w-32 mx-auto border-b-2 my-4" style={{ borderColor: `${theme.primary}30` }} />

      {/* Stats Section */}
      <section className="py-8 px-4 relative z-10 flex flex-col items-center justify-center border-x-2" style={{ backgroundColor: `${theme.panels}90`, minHeight: '320px', borderColor: `${theme.primary}30` }}>
        <div className="max-w-5xl w-full mx-auto">
            <h2 className="text-xl md:text-2xl font-bold mb-4 text-center" style={{ color: theme.text, fontFamily: 'Playfair Display, serif' }}>
              Our Excellence
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[{ number: '10K+', label: 'Distinguished Members', icon: <FaUsers /> }, { number: '500+', label: 'Premium Partners', icon: <FaCrown /> }, { number: '50K+', label: 'Curated Experiences', icon: <FaAward /> }, { number: '4.9', label: 'Excellence Rating', icon: <FaStar /> }].map((stat, index) => (
                <div
                  key={stat.label}
                  className="relative p-6 rounded-xl border shadow-md transition-all duration-500 hover:scale-105 cursor-pointer backdrop-blur-sm hover:shadow-lg border-x-2"
                  style={{
                    backgroundColor: `${theme.background}95`,
                    borderColor: `${theme.primary}30`,
                    boxShadow: `0 4px 16px ${theme.primary}10`,
                    minHeight: '180px',
                    height: '100%'
                  }}
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 mx-auto" style={{ backgroundColor: `${theme.primary}15`, color: theme.primary }}>
                    {stat.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-1 text-center" style={{ color: theme.text, fontFamily: 'Playfair Display, serif' }}>
                    {stat.number}
                  </h3>
                  <p className="font-medium text-xs text-center mb-2" style={{ color: theme.textSecondary }}>
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
        </div>
      </section>
      <div className="w-32 mx-auto border-b-2 my-4" style={{ borderColor: `${theme.primary}30` }} />

      {/* Testimonials Section */}
      <section className="py-8 px-4 relative z-10 flex flex-col items-center justify-center border-x-2" style={{ backgroundColor: `${theme.panels}90`, minHeight: '320px', borderColor: `${theme.primary}30` }}>
        <div className="max-w-5xl w-full mx-auto">
            <h2 className="text-xl md:text-2xl font-bold mb-4 text-center" style={{ color: theme.text, fontFamily: 'Playfair Display, serif' }}>
              Distinguished Voices
            </h2>
            <p className="text-base text-center mb-8 max-w-2xl mx-auto" style={{ color: theme.textSecondary }}>
              Testimonials from culinary experts and discerning patrons
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, idx) => (
                <div
                  key={testimonial.name}
                  className="relative p-6 rounded-xl border shadow-md transition-all duration-500 hover:scale-105 cursor-pointer backdrop-blur-sm hover:shadow-lg flex flex-col items-center justify-center border-x-2"
                  style={{
                    backgroundColor: `${theme.background}95`,
                    borderColor: `${theme.primary}30`,
                    boxShadow: `0 4px 16px ${theme.primary}10`,
                    minHeight: '180px',
                    height: '100%'
                  }}
                >
                  <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-xl mb-3 shadow-sm object-cover" style={{ border: `2px solid ${theme.primary}` }} />
                  <h3 className="font-bold text-base mb-1 text-center" style={{ color: theme.text, fontFamily: 'Playfair Display, serif' }}>
                    {testimonial.name}
                  </h3>
                  <p className="mb-2 text-sm leading-relaxed italic text-center" style={{ color: theme.textSecondary }}>
                    "{testimonial.text}"
                  </p>
                  <div className="text-xs font-medium text-center" style={{ color: theme.textSecondary }}>
                    {testimonial.role}
                  </div>
                </div>
              ))}
            </div>
        </div>
      </section>
      <div className="w-32 mx-auto border-b-2 my-4" style={{ borderColor: `${theme.primary}30` }} />

      {/* Call to Action Section */}
      <section className="py-8 px-4 text-center relative z-10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl md:text-2xl font-bold mb-4" style={{ color: theme.text, fontFamily: 'Playfair Display, serif' }}>
            Embark on Excellence
          </h2>
          <p className="text-base mb-8 max-w-2xl mx-auto leading-relaxed" style={{ color: theme.textSecondary }}>
            Join our exclusive community and elevate your culinary journey to extraordinary heights
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="group px-8 py-4 rounded-xl font-bold text-base transition-all duration-500 hover:scale-110 backdrop-blur-sm border flex items-center justify-center gap-2"
              style={{
                backgroundColor: theme.primary,
                borderColor: theme.primary,
                color: 'white',
                boxShadow: `0 8px 30px ${theme.primary}30`,
                fontFamily: 'Playfair Display, serif',
                letterSpacing: '1px'
              }}
            >
              <FaBolt />
              <span>Experience Excellence</span>
            </Link>
            <Link
              to="/vendor/login"
              className="group px-8 py-4 rounded-xl font-bold text-base transition-all duration-500 hover:scale-110 backdrop-blur-sm border flex items-center justify-center gap-2"
              style={{
                borderColor: theme.secondary,
                color: theme.secondary,
                backgroundColor: `${theme.secondary}10`,
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