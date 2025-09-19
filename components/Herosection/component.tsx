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
      <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight tracking-tight">
        A Digital Psychological Intervention System for{' '}
        <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
          Colleges
        </span>
      </h1>

      <p className="text-lg sm:text-xl md:text-2xl mb-8 opacity-90 max-w-3xl leading-relaxed font-medium">
        Reduce stigma. Detect early. Support at scale. A privacy-first mental health
        platform tailored for Indian higher education — urban to rural, English to regional.
      </p>

      <div className="mb-10 max-w-4xl">
        <p className="text-base sm:text-lg md:text-xl opacity-85 leading-relaxed">
          Built with faculty, counsellors, and students, the platform blends AI-guided first-aid,
          confidential booking, psychoeducational resources, peer support, and admin analytics —
          so institutions can care proactively while students get help without fear of judgment.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
        <a
          href="/auth"
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-full text-base transition-all duration-300 transform hover:scale-105 pointer-events-auto"
        >
          Get Support Now
        </a>
        <a
          href="/dashboard"
          className="bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-full text-base transition-all duration-300 border border-white/20 backdrop-blur pointer-events-auto"
        >
          For Administrators
        </a>
      </div>

      <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 opacity-90">
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="text-2xl font-bold">24/7</div>
          <div className="text-xs text-white/70">AI first-aid support</div>
        </div>
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="text-2xl font-bold">100%</div>
          <div className="text-xs text-white/70">confidential bookings</div>
        </div>
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="text-2xl font-bold">10+ </div>
          <div className="text-xs text-white/70">regional languages</div>
        </div>
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="text-2xl font-bold">Anonymous</div>
          <div className="text-xs text-white/70">trend analytics</div>
        </div>
      </div>
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
          position: 'absolute', top: 80, left: 0, width: '100%', height: 'calc(100vh - 80px)',
          display: 'flex', justifyContent: 'flex-start', alignItems: 'center', zIndex: 10, pointerEvents: 'none'
        }}>
          <div className="container mx-auto">
            <HeroContent />
          </div>
        </div>
      </div>

      {/* Main Landing Sections */}
      <main className="relative z-10 bg-gradient-to-b from-black via-[#0d0d18] to-black text-white">
        <section className="container mx-auto px-4 py-16 md:py-24">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6">What you can do here</h2>
          <p className="text-white/80 max-w-3xl mb-10">
            A unified system designed around the realities of Indian campuses — stigma-free,
            multilingual, customizable, and connected to your on-campus resources.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-xl font-semibold mb-2">AI-guided First-Aid Support</h3>
              <p className="text-white/75 mb-4">Interactive chat offers coping strategies, grounding, and next steps with escalation when needed.</p>
              <a href="/dashboard/input" className="text-sm text-blue-300 hover:text-blue-200">Try the support chat →</a>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-xl font-semibold mb-2">Confidential Booking</h3>
              <p className="text-white/75 mb-4">Book sessions with campus counsellors or helplines without exposing identity to peers.</p>
              <a href="/dashboard/theraphist" className="text-sm text-blue-300 hover:text-blue-200">Book an appointment →</a>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-xl font-semibold mb-2">Psychoeducational Hub</h3>
              <p className="text-white/75 mb-4">Guides, videos, sleep and relaxation audio in English and regional languages.</p>
              <a href="/dashboard/resources" className="text-sm text-blue-300 hover:text-blue-200">Browse resources →</a>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-xl font-semibold mb-2">Peer Support Platform</h3>
              <p className="text-white/75 mb-4">Moderated peer forums with trained student volunteers and clear community guidelines.</p>
              <a href="/dashboard/voice" className="text-sm text-blue-300 hover:text-blue-200">Join conversations →</a>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-xl font-semibold mb-2">Screening & Early Signals</h3>
              <p className="text-white/75 mb-4">Optional PHQ‑9, GAD‑7, GHQ screens help surface early risk and trigger support.</p>
              <a href="/dashboard/input" className="text-sm text-blue-300 hover:text-blue-200">Start a quick check →</a>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-xl font-semibold mb-2">Admin Analytics (Anonymous)</h3>
              <p className="text-white/75 mb-4">Trend dashboards help IQAC/DSW plan interventions without accessing identities.</p>
              <a href="/dashboard/data" className="text-sm text-blue-300 hover:text-blue-200">View a sample dashboard →</a>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6">Why this matters now</h2>
              <ul className="space-y-3 text-white/85">
                <li className="bg-white/5 border border-white/10 rounded-xl p-4">Anxiety, depression, burnout, sleep issues and isolation are rising on campuses.</li>
                <li className="bg-white/5 border border-white/10 rounded-xl p-4">Students under‑utilize counselling due to stigma and lack of awareness.</li>
                <li className="bg-white/5 border border-white/10 rounded-xl p-4">Colleges lack centralized, data‑driven, stigma‑free support systems.</li>
                <li className="bg-white/5 border border-white/10 rounded-xl p-4">Regional context and language support are often missing in global apps.</li>
              </ul>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-3">Institution‑ready by design</h3>
              <ul className="list-disc list-inside text-white/80 space-y-2">
                <li>Institutional customization for branding, counsellor mapping, helpline routing</li>
                <li>Multilingual content and UI for inclusive access</li>
                <li>Offline pathways integrated with on‑campus services</li>
                <li>Role‑based access with strong privacy guarantees</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16 md:py-24">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="text-sm uppercase tracking-wider text-white/60 mb-1">Step 1</div>
              <div className="font-semibold">Screen</div>
              <div className="text-white/75 text-sm">Optional PHQ‑9/GAD‑7/GHQ with instant guidance.</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="text-sm uppercase tracking-wider text-white/60 mb-1">Step 2</div>
              <div className="font-semibold">Support</div>
              <div className="text-white/75 text-sm">AI first‑aid chat offers coping strategies.</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="text-sm uppercase tracking-wider text-white/60 mb-1">Step 3</div>
              <div className="font-semibold">Book</div>
              <div className="text-white/75 text-sm">Confidential campus counsellor or helpline booking.</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="text-sm uppercase tracking-wider text-white/60 mb-1">Step 4</div>
              <div className="font-semibold">Learn</div>
              <div className="text-white/75 text-sm">Localized guides, videos, and relaxation audio.</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="text-sm uppercase tracking-wider text-white/60 mb-1">Step 5</div>
              <div className="font-semibold">Analyze</div>
              <div className="text-white/75 text-sm">Anonymous trends for IQAC/DSW via role‑based access.</div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Privacy & Ethics</h2>
            <p className="text-white/80 max-w-3xl">
              We prioritize safety, consent, and anonymity. Admins view aggregated, anonymized data only.
              Student identities are never exposed in analytics. Escalation to professionals follows clear,
              institution‑approved protocols.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6 bg-gradient-to-r from-purple-700/30 to-blue-700/30 border border-white/10 rounded-2xl p-6 md:p-8">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Bring stigma‑free support to your campus</h2>
              <p className="text-white/80">Start a pilot with your Department of Student Welfare / Psychology / IQAC.</p>
            </div>
            <div className="flex gap-3">
              <a href="/auth" className="bg-white text-black font-semibold py-3 px-6 rounded-full hover:bg-white/90 transition">Launch student view</a>
              <a href="/dashboard" className="bg-white/10 border border-white/20 text-white font-semibold py-3 px-6 rounded-full hover:bg-white/20 transition">Open admin demo</a>
            </div>
          </div>
        </section>

        <footer className="container mx-auto px-4 pb-16 text-white/60 text-sm">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div>© {new Date().getFullYear()} Synapse — Open, institution‑ready mental health support</div>
            <div className="space-x-4">
              <a href="/profile" className="hover:text-white">Profile</a>
              <a href="/dashboard" className="hover:text-white">Dashboard</a>
              <a href="/auth" className="hover:text-white">Sign in</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

  
