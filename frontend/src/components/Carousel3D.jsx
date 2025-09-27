import React, { useEffect, useRef } from 'react';

const Carousel3D = ({ theme }) => {
  const wrapperRef = useRef(null);
  const cardRefs = useRef([]);

  const testimonials = [
    {
      id: 1,
      name: "Aarav Sharma",
      role: "Executive Chef & Culinary Consultant",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
      text: "NourishNet has revolutionized how I discover authentic local cuisine. The platform's sophistication and attention to detail is remarkable.",
      rating: 5
    },
    {
      id: 2,
      name: "Priya Mehta",
      role: "Owner, Spice Heritage Restaurant",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face",
      text: "As a vendor, NourishNet provides an elegant platform that truly understands the artistry of food. Our business has flourished.",
      rating: 5
    },
    {
      id: 3,
      name: "Rahul Khanna",
      role: "Food & Lifestyle Critic",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
      text: "The premium experience and curated selection make every meal a sophisticated culinary journey. Absolutely exceptional.",
      rating: 5
    },
    {
      id: 4,
      name: "Maya Singh",
      role: "Food Blogger & Influencer",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
      text: "Every restaurant on NourishNet delivers an unforgettable experience. The quality and service standards are consistently outstanding.",
      rating: 5
    },
    {
      id: 5,
      name: "Arjun Patel",
      role: "Michelin Star Chef",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop&crop=face",
      text: "NourishNet connects food lovers with truly exceptional dining experiences. The curation is impeccable and the platform is beautifully crafted.",
      rating: 5
    }
  ];

  useEffect(() => {
    if (!wrapperRef.current) return;
    
    const cards = cardRefs.current;
    const radius = 300;
    
    cards.forEach((card, i) => {
      if (card) {
        card.style.transform = `rotateY(${i * 360 / cards.length}deg) translateZ(${radius}px)`;
      }
    });

    // Simple rotation animation - only rotate, no other effects
    const wrapper = wrapperRef.current;
    let rotation = 0;
    
    const animate = () => {
      rotation += 0.3; // Slower rotation for testimonials
      wrapper.style.transform = `rotateY(${rotation}deg)`;
      requestAnimationFrame(animate);
    };
    
    animate();
  }, []);

  // Simple testimonial carousel styles - only rotation effect
  const styles = {
    carousel3dBg: {
      minHeight: '60vh',
      background: `linear-gradient(135deg, ${theme.background}, ${theme.panels})`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 0'
    },
    carousel3dWrapper: {
      width: '700px',
      height: '400px',
      margin: '50px auto',
      perspective: '1200px',
      transformStyle: 'preserve-3d',
      position: 'relative'
    },
    carousel3dCard: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: '16rem',
      height: '300px',
      background: `linear-gradient(135deg, ${theme.panels}95, ${theme.background}90)`,
      borderRadius: '20px',
      boxShadow: `0 15px 40px ${theme.primary}20, 0 0 25px ${theme.primary}10`,
      transformStyle: 'preserve-3d',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      border: `2px solid ${theme.primary}25`,
      backdropFilter: 'blur(15px)',
      marginLeft: '-8rem',
      padding: '25px',
      textAlign: 'center',
    },
    avatar: {
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      objectFit: 'cover',
      marginBottom: '20px',
      border: `3px solid ${theme.primary}50`,
      boxShadow: `0 4px 20px ${theme.primary}30`,
    },
    testimonialText: {
      fontSize: '0.95rem',
      fontStyle: 'italic',
      color: theme.text,
      lineHeight: '1.6',
      margin: '0 0 20px 0',
      maxHeight: '80px',
      overflow: 'hidden',
    },
    authorName: {
      fontSize: '1.1rem',
      fontWeight: 'bold',
      color: theme.primary,
      margin: '0 0 5px 0',
      textShadow: `0 0 10px ${theme.primary}40`,
    },
    authorRole: {
      fontSize: '0.85rem',
      color: theme.textSecondary,
      margin: '0 0 15px 0',
    },
    stars: {
      color: '#FFD700',
      fontSize: '1.2rem',
      display: 'flex',
      gap: '2px',
      justifyContent: 'center',
    }
  };

  return (
    <div style={styles.carousel3dBg}>
      <div style={styles.carousel3dWrapper} ref={wrapperRef}>
        {testimonials.map((testimonial, i) => (
          <div
            style={styles.carousel3dCard}
            key={testimonial.id}
            ref={el => cardRefs.current[i] = el}
          >
            <img 
              src={testimonial.avatar} 
              alt={testimonial.name} 
              style={styles.avatar} 
            />
            
            <p style={styles.testimonialText}>
              "{testimonial.text}"
            </p>
            
            <h4 style={styles.authorName}>
              {testimonial.name}
            </h4>
            
            <p style={styles.authorRole}>
              {testimonial.role}
            </p>
            
            <div style={styles.stars}>
              {[...Array(testimonial.rating)].map((_, index) => (
                <span key={index}>★</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Carousel3D;