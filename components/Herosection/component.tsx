"use client";

import React, { useEffect, useRef, useState } from 'react';
import {  lazy } from 'react'
import { useRouter } from 'next/navigation';
const Spline = lazy(() => import('@splinetool/react-spline'))


function HeroSplineBackground() {
  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100vh',
      pointerEvents: 'auto',
      overflow: 'hidden',
    }}>
      <Spline
        style={{
          width: '100%',
          height: '100vh',
          pointerEvents: 'auto',
        }}
        scene="https://prod.spline.design/us3ALejTXl6usHZ7/scene.splinecode"
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          background: `
            linear-gradient(to right, rgba(0, 0, 0, 0.8), transparent 30%, transparent 70%, rgba(0, 0, 0, 0.8)),
            linear-gradient(to bottom, transparent 50%, rgba(0, 0, 0, 0.9))
          `,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}

function HeroContent() {
  const router = useRouter();

  const handleCompleteProfile = () => {
    router.push('/profile');
  };

  return (
    <div className="text-left text-white pt-20 sm:pt-28 md:pt-36 px-4 max-w-5xl">
      {/* Main Heading */}
      <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight tracking-tight">
        Transforming Young Minds Through{' '}
        <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
          AI-Powered
        </span>{' '}
        <br className="sm:hidden" />
        Cognitive Training
      </h1>

      {/* Subtitle */}
      <p className="text-lg sm:text-xl md:text-2xl mb-8 opacity-90 max-w-3xl leading-relaxed font-medium">
        The first platform to combine real-time brain monitoring, 
        adaptive learning, and collaborative care for children with 
        ADHD, Autism, and learning disabilities.
      </p>

      {/* Description */}
      <div className="mb-12 max-w-4xl">
        <p className="text-base sm:text-lg md:text-xl opacity-80 leading-relaxed">
          Synapse connects children, parents, and therapists in a revolutionary 
          ecosystem that makes cognitive training engaging, measurable, and accessible. 
          Our AI adapts to each child&apos;s unique learning patterns while providing 
          families and professionals with unprecedented insights into cognitive development.
        </p>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
     
      
    
        
      
      </div>

      {/* Stats Section */}
  
    </div>
  );
}

function Navbar() {
  const [hoveredNavItem, setHoveredNavItem] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileDropdowns, setMobileDropdowns] = useState({
    features: false,
    enterprise: false,
    resources: false,
  });

  const handleMouseEnterNavItem = (item: string) => setHoveredNavItem(item);
  const handleMouseLeaveNavItem = () => setHoveredNavItem(null);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (isMobileMenuOpen) {
      setMobileDropdowns({ features: false, enterprise: false, resources: false });
    }
  };

  const toggleMobileDropdown = (key: keyof typeof mobileDropdowns) => {
    setMobileDropdowns(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const navLinkClass = (itemName: string, extraClasses = '') => {
    const isCurrentItemHovered = hoveredNavItem === itemName;
    const isAnotherItemHovered = hoveredNavItem !== null && !isCurrentItemHovered;

    const colorClass = isCurrentItemHovered
      ? 'text-white'
      : isAnotherItemHovered
        ? 'text-gray-500'
        : 'text-gray-300';

     return `text-sm transition duration-150 ${colorClass} ${extraClasses}`;
  };

   useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
         setMobileDropdowns({ features: false, enterprise: false, resources: false });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobileMenuOpen]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-20" style={{ backgroundColor: 'rgba(13, 13, 24, 0.3)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', borderRadius: '0 0 15px 15px' }}>
      <div className="container mx-auto px-4 py-4 md:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="text-white font-bold text-2xl bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Synapse
          </div>

          <div className="hidden lg:flex items-center space-x-6">
            <div className="relative group" onMouseEnter={() => handleMouseEnterNavItem('features')} onMouseLeave={handleMouseLeaveNavItem}>
            
              <div className="absolute left-0 mt-2 w-48 bg-black bg-opacity-50 rounded-md shadow-lg py-2 border border-gray-700/30 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-30" style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}>
          
              </div>
            </div>

            <div className="relative group" onMouseEnter={() => handleMouseEnterNavItem('enterprise')} onMouseLeave={handleMouseLeaveNavItem}>
            
        
            </div>

            <div className="relative group" onMouseEnter={() => handleMouseEnterNavItem('resources')} onMouseLeave={handleMouseLeaveNavItem}>
            
               <div className="absolute left-0 mt-2 w-48 bg-black bg-opacity-50 rounded-md shadow-lg py-2 border border-gray-700/30 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-30" style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}>
        
              </div>
            </div>

          
          </div>
        </div>

        <div className="flex items-center space-x-4 md:space-x-6">
       
          <a href="/profile" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-2 px-5 rounded-full text-sm md:text-base transition-all duration-300 transform hover:scale-105">Go To Profile</a>
          <button className="lg:hidden text-white p-2" onClick={toggleMobileMenu} aria-label="Toggle mobile menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} /></svg>
          </button>
        </div>
      </div>

      <div className={`lg:hidden bg-black bg-opacity-50 border-t border-gray-700/30 absolute top-full left-0 right-0 z-30
           overflow-hidden transition-all duration-300 ease-in-out
           ${isMobileMenuOpen ? 'max-h-screen opacity-100 pointer-events-auto' : 'max-h-0 opacity-0 pointer-events-none'}
           `}
           style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
      >
        <div className="px-4 py-6 flex flex-col space-y-4">
          <div className="relative">
            <button className="text-gray-300 hover:text-gray-100 flex items-center justify-between w-full text-left text-sm py-2" onClick={() => toggleMobileDropdown('features')} aria-expanded={mobileDropdowns.features}>
              Features
              <svg className={`ml-2 w-3 h-3 transition-transform duration-200 ${mobileDropdowns.features ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </button>
            <div className={`pl-4 space-y-2 mt-2 overflow-hidden transition-all duration-300 ease-in-out ${mobileDropdowns.features ? 'max-h-[200px] opacity-100 pointer-events-auto' : 'max-h-0 opacity-0 pointer-events-none'}`}>
              <a href="#" className="block text-gray-300 hover:text-gray-100 text-sm py-1 transition duration-150" onClick={toggleMobileMenu}>Feature 1</a>
              <a href="#" className="block text-gray-300 hover:text-gray-100 text-sm py-1 transition duration-150" onClick={toggleMobileMenu}>Feature 2</a>
              <a href="#" className="block text-gray-300 hover:text-gray-100 text-sm py-1 transition duration-150" onClick={toggleMobileMenu}>Feature 3</a>
            </div>
          </div>
          <div className="relative">
             <button className="text-gray-300 hover:text-gray-100 flex items-center justify-between w-full text-left text-sm py-2" onClick={() => toggleMobileDropdown('enterprise')} aria-expanded={mobileDropdowns.enterprise}>
              Enterprise
              <svg className={`ml-2 w-3 h-3 transition-transform duration-200 ${mobileDropdowns.enterprise ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </button>
            <div className={`pl-4 space-y-2 mt-2 overflow-hidden transition-all duration-300 ease-in-out ${mobileDropdowns.enterprise ? 'max-h-[200px] opacity-100 pointer-events-auto' : 'max-h-0 opacity-0 pointer-events-none'}`}>
              <a href="#" className="block text-gray-300 hover:text-gray-100 text-sm py-1 transition duration-150" onClick={toggleMobileMenu}>Solution A</a>
              <a href="#" className="block text-gray-300 hover:text-gray-100 text-sm py-1 transition duration-150" onClick={toggleMobileMenu}>Solution B</a>
            </div>
          </div>
          <div className="relative">
            <button className="text-gray-300 hover:text-gray-100 flex items-center justify-between w-full text-left text-sm py-2" onClick={() => toggleMobileDropdown('resources')} aria-expanded={mobileDropdowns.resources}>
              Resources
              <svg className={`ml-2 w-3 h-3 transition-transform duration-200 ${mobileDropdowns.resources ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </button>
             <div className={`pl-4 space-y-2 mt-2 overflow-hidden transition-all duration-300 ease-in-out ${mobileDropdowns.resources ? 'max-h-[250px] opacity-100 pointer-events-auto' : 'max-h-0 opacity-0 pointer-events-none'}`}>
              <a href="#" className="block text-gray-300 hover:text-gray-100 text-sm py-1 transition duration-150" onClick={toggleMobileMenu}>Blog</a>
              <a href="#" className="block text-gray-300 hover:text-gray-100 text-sm py-1 transition duration-150" onClick={toggleMobileMenu}>Docs</a>
              <a href="#" className="block text-gray-300 hover:text-gray-100 text-sm py-1 transition duration-150" onClick={toggleMobileMenu}>Support</a>
            </div>
          </div>
          <a href="#" className="text-gray-300 hover:text-gray-100 text-sm py-2 transition duration-150" onClick={toggleMobileMenu}>Pricing</a>
          <a href="#" className="text-gray-300 hover:text-gray-100 text-sm py-2 transition duration-150" onClick={toggleMobileMenu}>Contact Sales</a>
          <a href="#" className="text-gray-300 hover:text-gray-100 text-sm py-2 transition duration-150" onClick={toggleMobileMenu}>Sign In</a>
        </div>
      </div>
    </nav>
  );
}

export const HeroSection = () => {
  const heroContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (heroContentRef.current) {
        requestAnimationFrame(() => {
          const scrollPosition = window.pageYOffset;
          const maxScroll = 400;
          const opacity = 1 - Math.min(scrollPosition / maxScroll, 1);
          heroContentRef.current!.style.opacity = opacity.toString();
        });
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative">
      <Navbar />

      <div className="relative min-h-screen">
        <div className="absolute inset-0 z-0 pointer-events-auto">
          <HeroSplineBackground />
        </div>

        <div ref={heroContentRef} style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100vh',
          display: 'flex', justifyContent: 'flex-start', alignItems: 'center', zIndex: 10, pointerEvents: 'none'
        }}>
          <div className="container mx-auto">
            <HeroContent />
          </div>
        </div>
      </div>
    </div>
  );
};

  
