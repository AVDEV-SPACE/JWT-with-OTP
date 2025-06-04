'use client';
import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { MdMenu, MdClose } from "react-icons/md";
import { TbSettings } from "react-icons/tb";
import { LuFileSearch } from "react-icons/lu";
import { IoStatsChartOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import "../styles/navbar.css";

gsap.registerPlugin();

// Characters for the shuffle effect
const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";

// Shuffle function for letters
const shuffleText = (element, originalText) => {
  if (!element) return;
  
  // Save original text to use at the end
  const originalContent = originalText;
  
  // Create container to hold all characters
  element.innerHTML = '';
  const maxIterations = 6;
  const iterationDelay = 20;

  const animateAllLetters = () => {
    for (let i = 0; i < originalContent.length; i++) {
      const span = document.createElement('span');
      span.classList.add('title-letter');
      span.style.display = 'inline-block'; // Ensure each character has fixed size
      span.style.width = 'auto'; // Width will be calculated automatically
      span.style.textAlign = 'center'; // Center text

      if (originalContent[i] === ' ') {
        span.innerHTML = '&nbsp;';
        element.appendChild(span);
        continue;
      }
      
      // Add initial text with same size as final text
      span.textContent = originalContent[i];
      
      // Measure and fix width for each character
      element.appendChild(span);
      const initialWidth = span.offsetWidth;
      span.style.width = `${initialWidth}px`;
      span.style.minWidth = `${initialWidth}px`;
      
      // Now we can start animation with fixed width
      span.textContent = chars[Math.floor(Math.random() * chars.length)];
      animateLetter(span, originalContent[i], maxIterations, i * 20);
    }
  };

  const animateLetter = (span, finalChar, iterations, startDelay = 0) => {
    let currentIteration = 0;
    setTimeout(() => {
      const interval = setInterval(() => {
        span.textContent = chars[Math.floor(Math.random() * chars.length)];
        currentIteration++;
        if (currentIteration >= iterations) {
          clearInterval(interval);
          span.textContent = finalChar;
        }
      }, iterationDelay);
    }, startDelay);
  };

  animateAllLetters();
};

// Component for animating navbar text
const AnimatedNavbarText = forwardRef(({ text }, ref) => {
  const textRef = useRef(null);
  const originalText = text;
  const containerRef = useRef(null);

  useEffect(() => {
    // When component is mounted, measure and fix container width
    if (containerRef.current) {
      const textWidth = containerRef.current.offsetWidth;
      containerRef.current.style.width = `${textWidth}px`;
      containerRef.current.style.minWidth = `${textWidth}px`;
      containerRef.current.style.display = 'inline-block';
    }
  }, [text]);

  useImperativeHandle(ref, () => ({
    animate() {
      if (textRef.current) {
        shuffleText(textRef.current, originalText);
      }
    },
    reset() {
      if (textRef.current) {
        textRef.current.innerText = originalText;
      }
    }
  }));

  return (
    <span ref={containerRef} style={{ display: 'inline-block', overflow: 'hidden' }}>
      <span ref={textRef} style={{ display: 'inline-block' }}>{originalText}</span>
    </span>
  );
});

// Animated button component
const AnimatedButton = ({ text, href, Icon, onClick }) => {
  const animatedTextRef = useRef(null);
  const textContainerRef = useRef(null);
  
  useEffect(() => {
    if (textContainerRef.current) {
      // Fix container width
      const width = textContainerRef.current.offsetWidth;
      textContainerRef.current.style.width = `${width}px`;
      textContainerRef.current.style.minWidth = `${width}px`;
    }
  }, [text]);
  
  const handleMouseEnter = () => {
    if (animatedTextRef.current) animatedTextRef.current.animate();
  };
  
  const handleMouseLeave = () => {
    if (animatedTextRef.current) animatedTextRef.current.reset();
  };
  
  return (
    <div
      className="animatedButton"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      <a href={href} className="text-white flex items-center whitespace-nowrap">
        {Icon && <Icon size={18} className="mr-2 icons" style={{ flexShrink: 0 }} />}
        <span className="relative" ref={textContainerRef} style={{ overflow: 'hidden', display: 'inline-block' }}>
          <AnimatedNavbarText ref={animatedTextRef} text={text} />
        </span>
      </a>
    </div>
  );
};

// Dashboard item component - updated to match DockItem behavior
const DashboardItem = ({ IconComponent, text, onClick }) => {
  const [isHovering, setIsHovering] = useState(false);
  const [screenWidth, setScreenWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
  const animatedTextRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Fix dimensions for text container
  useEffect(() => {
    if (containerRef.current) {
      const width = containerRef.current.offsetWidth;
      containerRef.current.style.width = `${width}px`;
      containerRef.current.style.minWidth = `${width}px`;
    }
  }, [text]);

  const isTablet = screenWidth >= 500 && screenWidth < 768;
  const isDesktop = screenWidth >= 768;

  const handleMouseEnter = () => {
    setIsHovering(true);
    if (animatedTextRef.current) animatedTextRef.current.animate();
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    if (animatedTextRef.current) animatedTextRef.current.reset();
  };

  return (
    <div
      className="dock-item relative flex items-center w-full"
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <IconComponent size="16px" className="text-neutral-400 icon_big" style={{ flexShrink: 0 }} />
      <span 
        ref={containerRef}
        className={`dock-item-text ${
          isDesktop ? 'md-visible' : 
          isTablet && isHovering ? 'tablet-hover-visible' : 
          'hidden'
        }`}
        style={{ display: 'inline-block', overflow: 'hidden' }}
      >
        <AnimatedNavbarText ref={animatedTextRef} text={text} />
      </span>
    </div>
  );
};

const NavbarDashboard = () => {
  const navbarRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  const icons = [
    { icon: TbSettings, text: "Actions", onClick: () => router.push("/admin") },
    { icon: LuFileSearch, text: "Filters", onClick: () => router.push("/admin/filters") },
    { icon: IoStatsChartOutline, text: "Stats", onClick: () => router.push("/admin/statistics") },
  ];

  useEffect(() => {
    gsap.fromTo(
      navbarRef.current,
      { y: -120, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.3, delay: 0.45, ease: 'power4.out' }
    );
  }, []);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 500);
      setIsTablet(width >= 500 && width < 768);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    let lastScrollTop = 0;
    let isAnimating = false;

    gsap.set(navbarRef.current, { y: 0 });

    const handleScroll = () => {
      if (!navbarRef.current || isAnimating) return;

      const currentScroll = window.scrollY;
      const navbarHeight = navbarRef.current.offsetHeight;

      if (currentScroll > lastScrollTop && currentScroll > 50) {
        isAnimating = true;
        gsap.to(navbarRef.current, {
          y: `-${navbarHeight + 250}px`,
          duration: 0.75,
          ease: "easeInOutQuad",
          onComplete: () => (isAnimating = false),
        });
      } else if (currentScroll < lastScrollTop) {
        isAnimating = true;
        gsap.to(navbarRef.current, {
          y: 0,
          duration: 0.75,
          ease: "easeInOutQuad",
          onComplete: () => (isAnimating = false),
        });
      }

      lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);

    if (!isMenuOpen) {
      gsap.fromTo(
        mobileMenuRef.current,
        { y: '-100%', opacity: 0 },
        { y: '0%', opacity: 1, duration: 0.5, ease: 'power4.out' }
      );

      gsap.fromTo(
        '.mobile-menu-item',
        { y: 30, opacity: 0, clipPath: 'polygon(0 0, 100% 0, 100% 0, 0% 0)' },
        {
          y: 0,
          opacity: 1,
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)',
          duration: 0.5,
          ease: 'power4.out',
          stagger: 0.1,
          delay: 0.2,
        }
      );

      gsap.fromTo(
        '.close-menu-button',
        { opacity: 0, scale: 0.5, rotation: -180 },
        { opacity: 1, scale: 1, rotation: 0, duration: 0.3, ease: 'power4.out', delay: 0.3 }
      );
    } else {
      gsap.to(mobileMenuRef.current, {
        y: '-100%',
        opacity: 0,
        duration: 0.4,
        ease: 'power4.in',
        onComplete: () => {
          gsap.set('.mobile-menu-item', {
            y: 30,
            opacity: 0,
            clipPath: 'polygon(0 0, 100% 0, 100% 0, 0% 0)'
          });
        }
      });
    }
  };

  return (
    <>
      <div
        ref={navbarRef}
        style={{
          opacity: 0,
          transform: 'translateY(-120px)'
        }}
        className="dock-container navbar nav_dash"
      >
        <Link href="/" className="cursor-pointer md:ml-3">
          <Image
            src="/assets/icons/logo-full.svg"
            width={22}
            height={162}
            alt="logo"
            className="h-8 w-fit"
          />
        </Link>

        {/* Desktop Menu */}
        <div className="beta mr-auto md:text-[12px] text-[7px]">
            <p>Beta v1.0</p>
        </div>

        <div className= {`dock_nav px-3 md:flex ${isMobile ? '' : 'border_unv nav_gradient1'}`}>
            <div className="nav_links_container w-full">
                {icons.map((item, index) => (
            <div key={index} onClick={item.onClick ? item.onClick : null}>
            <DashboardItem
                IconComponent={item.icon}
                text={item.text}
                onClick={item.onClick ? item.onClick : null}
            />
            </div>
                ))}
            </div>
        </div>
        
        {/* Admin & Mobile Menu Controls */}
        <div className="flex items-center gap-2 mobile-controls">
          <Link href="/profile" passHref className="w-full">
            <div id="adminButton" className="border_unv dock-item-link-wrap rounded-lg">
              <AnimatedButton text="Admin" href="/profile" />
            </div>
          </Link>

          <button
            className="mobile-menu-button"
            onClick={handleMenuToggle}
            aria-label="Toggle menu"
          >
            <MdMenu size={26} className="text-white" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div ref={mobileMenuRef} className={`mobile-menu rounded-md mt-5 ${isMenuOpen ? 'open' : ''}`}>
        <div className="w-full flex justify-between items-center mt-2 topmen">
          <h3 className='mt-3'>Dashboard Menu</h3>
          <button
            className="close-menu-button"
            onClick={handleMenuToggle}
            aria-label="Close menu"
          >
            <MdClose size={26} className="text-white" />
          </button>
        </div>
        <div className="mobile-menu-content">
          {icons.map((item, index) => (
            <div
              key={index}
              className="mobile-menu-item flex justify-between items-center w-full"
              onClick={() => {
                if (item.onClick) item.onClick();
                handleMenuToggle();
              }}
            >
              <span className="text-2xl text-white w-full pb-4" style={{ display: 'inline-block' }}>
                <AnimatedNavbarText text={item.text} />
              </span>
              <item.icon size="35px" className="text-white" style={{ flexShrink: 0 }} />
            </div>
          ))}
        </div>
      </div>

      <div className="mobile-menu-overlay"></div>
    </>
  );
};

export default NavbarDashboard;