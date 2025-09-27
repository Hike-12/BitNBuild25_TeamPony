import React, { useState, useEffect } from 'react';
import { FaStar, FaMapMarkerAlt, FaClock, FaPhone, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const RestaurantArtCards = ({ theme }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const restaurants = [
    {
      id: 1,
      name: "Saffron & Sage",
      cuisine: "Contemporary Indian",
      rating: 4.9,
      reviews: 245,
      distance: "0.2 km",
      time: "25-30 min",
      phone: "+91 98765 43210",
      image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&h=600&fit=crop&crop=center",
      description: "Authentic Indian flavors with a modern twist, featuring aromatic spices and fresh ingredients.",
      price: "₹₹₹",
      specialty: "Tandoor Specialties"
    },
    {
      id: 2,
      name: "Casa Madera",
      cuisine: "Artisan Mexican",
      rating: 4.8,
      reviews: 189,
      distance: "0.5 km",
      time: "20-25 min",
      phone: "+91 98765 43211",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500&h=600&fit=crop&crop=center",
      description: "Traditional Mexican cuisine with handcrafted tortillas and authentic salsas.",
      price: "₹₹",
      specialty: "Handmade Tacos"
    },
    {
      id: 3,
      name: "Golden Bamboo",
      cuisine: "Pan-Asian Fusion",
      rating: 4.7,
      reviews: 312,
      distance: "0.3 km",
      time: "30-35 min",
      phone: "+91 98765 43212",
      image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&h=600&fit=crop&crop=center",
      description: "Exquisite fusion of Asian flavors with creative presentation and fresh ingredients.",
      price: "₹₹₹₹",
      specialty: "Sushi & Ramen"
    },
    {
      id: 4,
      name: "Bella Vista",
      cuisine: "Authentic Italian",
      rating: 4.6,
      reviews: 156,
      distance: "0.7 km",
      time: "35-40 min",
      phone: "+91 98765 43213",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500&h=600&fit=crop&crop=center",
      description: "Classic Italian dishes prepared with imported ingredients and traditional recipes.",
      price: "₹₹₹",
      specialty: "Wood-fired Pizza"
    },
    {
      id: 5,
      name: "Ocean Breeze",
      cuisine: "Fresh Seafood",
      rating: 4.8,
      reviews: 201,
      distance: "0.4 km",
      time: "25-30 min",
      phone: "+91 98765 43214",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500&h=600&fit=crop&crop=center",
      description: "Fresh catch of the day prepared with coastal spices and Mediterranean influences.",
      price: "₹₹₹₹",
      specialty: "Daily Fresh Catch"
    }
  ];

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % restaurants.length);
    setTimeout(() => setIsAnimating(false), 800);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + restaurants.length) % restaurants.length);
    setTimeout(() => setIsAnimating(false), 800);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  // Art Cards Styles
  const styles = {
    container: {
      position: 'relative',
      width: '100%',
      maxWidth: '1400px',
      margin: '0 auto',
      height: '600px',
      overflow: 'hidden',
      borderRadius: '30px',
      background: `linear-gradient(135deg, ${theme.background}95, ${theme.panels}90)`,
      backdropFilter: 'blur(20px)',
      border: `3px solid ${theme.primary}20`,
      boxShadow: `
        0 0 50px ${theme.primary}15,
        0 0 100px ${theme.primary}08,
        inset 0 0 50px ${theme.primary}05
      `
    },
    cardContainer: {
      position: 'relative',
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    card: {
      position: 'absolute',
      width: '350px',
      height: '500px',
      borderRadius: '25px',
      overflow: 'hidden',
      transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      cursor: 'pointer',
      boxShadow: `0 20px 60px ${theme.primary}20`,
      border: `2px solid ${theme.primary}30`
    },
    cardImage: {
      width: '100%',
      height: '60%',
      objectFit: 'cover',
      transition: 'transform 0.6s ease'
    },
    cardContent: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '40%',
      background: `linear-gradient(135deg, ${theme.panels}95, ${theme.background}85)`,
      backdropFilter: 'blur(15px)',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.3) 100%)',
      opacity: 0,
      transition: 'opacity 0.3s ease'
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: theme.primary,
      marginBottom: '8px',
      fontFamily: 'Playfair Display, serif',
      textShadow: `0 2px 10px ${theme.primary}30`
    },
    cuisine: {
      fontSize: '14px',
      color: theme.secondary,
      marginBottom: '12px',
      fontWeight: '600',
      letterSpacing: '0.5px',
      textTransform: 'uppercase'
    },
    description: {
      fontSize: '13px',
      color: theme.textSecondary,
      lineHeight: '1.4',
      marginBottom: '16px'
    },
    stats: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: '12px'
    },
    rating: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      color: theme.primary,
      fontWeight: 'bold'
    },
    priceTag: {
      position: 'absolute',
      top: '16px',
      right: '16px',
      padding: '8px 12px',
      borderRadius: '20px',
      background: `${theme.primary}90`,
      color: 'white',
      fontSize: '12px',
      fontWeight: 'bold',
      backdropFilter: 'blur(10px)'
    },
    specialtyTag: {
      position: 'absolute',
      top: '16px',
      left: '16px',
      padding: '6px 12px',
      borderRadius: '15px',
      background: `${theme.secondary}20`,
      color: theme.secondary,
      fontSize: '11px',
      fontWeight: '600',
      border: `1px solid ${theme.secondary}40`,
      backdropFilter: 'blur(5px)'
    },
    navButton: {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      border: `3px solid ${theme.primary}60`,
      background: `${theme.background}90`,
      color: theme.primary,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backdropFilter: 'blur(10px)',
      boxShadow: `0 8px 25px ${theme.primary}25`,
      zIndex: 10,
      fontSize: '20px'
    },
    indicators: {
      position: 'absolute',
      bottom: '30px',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: '12px',
      zIndex: 10
    },
    indicator: {
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      border: `2px solid ${theme.primary}60`,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      backdropFilter: 'blur(5px)'
    }
  };

  const getCardStyle = (index) => {
    const diff = index - currentIndex;
    const totalCards = restaurants.length;
    
    let normalizedDiff = diff;
    if (Math.abs(diff) > totalCards / 2) {
      normalizedDiff = diff > 0 ? diff - totalCards : diff + totalCards;
    }

    const isCenter = normalizedDiff === 0;
    const isLeft = normalizedDiff === -1;
    const isRight = normalizedDiff === 1;
    
    let transform = '';
    let zIndex = 1;
    let opacity = 0.4;
    let scale = 0.8;
    
    if (isCenter) {
      transform = 'translateX(0px) translateZ(0px) rotateY(0deg)';
      zIndex = 5;
      opacity = 1;
      scale = 1;
    } else if (isLeft) {
      transform = 'translateX(-280px) translateZ(-200px) rotateY(35deg)';
      zIndex = 3;
      opacity = 0.7;
      scale = 0.85;
    } else if (isRight) {
      transform = 'translateX(280px) translateZ(-200px) rotateY(-35deg)';
      zIndex = 3;
      opacity = 0.7;
      scale = 0.85;
    } else {
      transform = `translateX(${normalizedDiff * 400}px) translateZ(-400px) rotateY(${normalizedDiff * 45}deg)`;
      zIndex = 1;
      opacity = 0.3;
      scale = 0.7;
    }

    return {
      ...styles.card,
      transform: `${transform} scale(${scale})`,
      zIndex,
      opacity,
      transformStyle: 'preserve-3d'
    };
  };

  return (
    <div style={styles.container}>
      <div style={{
        ...styles.cardContainer,
        perspective: '1200px',
        transformStyle: 'preserve-3d'
      }}>
        {restaurants.map((restaurant, index) => (
          <div
            key={restaurant.id}
            style={getCardStyle(index)}
            onMouseEnter={(e) => {
              e.currentTarget.querySelector('.overlay').style.opacity = '1';
              e.currentTarget.querySelector('.card-image').style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.querySelector('.overlay').style.opacity = '0';
              e.currentTarget.querySelector('.card-image').style.transform = 'scale(1)';
            }}
          >
            <img
              src={restaurant.image}
              alt={restaurant.name}
              style={styles.cardImage}
              className="card-image"
            />
            
            <div style={styles.overlay} className="overlay" />
            
            <div style={styles.priceTag}>
              {restaurant.price}
            </div>
            
            <div style={styles.specialtyTag}>
              {restaurant.specialty}
            </div>
            
            <div style={styles.cardContent}>
              <div>
                <h3 style={styles.title}>{restaurant.name}</h3>
                <p style={styles.cuisine}>{restaurant.cuisine}</p>
                <p style={styles.description}>{restaurant.description}</p>
              </div>
              
              <div style={styles.stats}>
                <div style={styles.rating}>
                  <FaStar />
                  <span>{restaurant.rating}</span>
                  <span style={{ color: theme.textSecondary, marginLeft: '4px' }}>
                    ({restaurant.reviews})
                  </span>
                </div>
                <div style={{ color: theme.textSecondary }}>
                  {restaurant.distance} • {restaurant.time}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        style={{ ...styles.navButton, left: '30px' }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'translateY(-50%) scale(1.1)';
          e.target.style.boxShadow = `0 12px 35px ${theme.primary}40`;
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(-50%) scale(1)';
          e.target.style.boxShadow = `0 8px 25px ${theme.primary}25`;
        }}
        disabled={isAnimating}
      >
        <FaChevronLeft />
      </button>
      
      <button
        onClick={nextSlide}
        style={{ ...styles.navButton, right: '30px' }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'translateY(-50%) scale(1.1)';
          e.target.style.boxShadow = `0 12px 35px ${theme.primary}40`;
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(-50%) scale(1)';
          e.target.style.boxShadow = `0 8px 25px ${theme.primary}25`;
        }}
        disabled={isAnimating}
      >
        <FaChevronRight />
      </button>

      {/* Indicators */}
      <div style={styles.indicators}>
        {restaurants.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (!isAnimating && index !== currentIndex) {
                setIsAnimating(true);
                setCurrentIndex(index);
                setTimeout(() => setIsAnimating(false), 800);
              }
            }}
            style={{
              ...styles.indicator,
              background: index === currentIndex ? theme.primary : 'transparent',
              boxShadow: index === currentIndex ? `0 0 20px ${theme.primary}60` : 'none',
              transform: index === currentIndex ? 'scale(1.3)' : 'scale(1)'
            }}
            onMouseEnter={(e) => {
              if (index !== currentIndex) {
                e.target.style.background = `${theme.primary}50`;
              }
            }}
            onMouseLeave={(e) => {
              if (index !== currentIndex) {
                e.target.style.background = 'transparent';
              }
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default RestaurantArtCards;