'use client';
import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../../styles/header.css';
import Image from 'next/image';
import DotPattern from '@/components/ui/dot-pattern';
import Navbar from '../Navbar';
import { cn } from '@/lib/utils';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const phrases = [
  "We build for the future. Meet the fastest",
  "most secure, and compliant platform to automate",
  "your team's tasks and digital assets."
];

const lettersAndSymbols = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '!', '@', '#', '$', '%', '^', '&', '*', '-', '_', '+', '=', ';', ':', '<', '>', ','];

const Header = ({ isLoading }) => {
  const titleRef1 = useRef(null);
  const titleRef2 = useRef(null);
  const iconRef = useRef(null);
  const [titlesVisible, setTitlesVisible] = useState(false);

  // Typewriter effect function (now properly defined)
  const typewriterEffect = (element, text, delay = 0) => {
    if (!element || !text) return;
    
    // Clear and prepare element
    element.innerHTML = '';
    element.style.visibility = 'visible';
    element.style.opacity = '1';
    
    const chars = text.split('');
    
    chars.forEach((char, index) => {
      const span = document.createElement('span');
      span.classList.add('typing-char');
      Object.assign(span.style, {
        opacity: '0',
        display: 'inline-block',
        verticalAlign: 'top'
      });
      
      span.textContent = char === ' ' ? '\u00A0' : char;
      element.appendChild(span);
      
      // Animate each character
      gsap.to(span, {
        opacity: 1,
        duration: 0.05,
        delay: delay + (index * 0.03),
        ease: 'none'
      });
    });
  };

  // Shuffle effect with no Y-axis movement
  const applyShuffleEffect = (element, originalText) => {
    if (!element || !originalText) return;

    // Lock Y position
    gsap.set(element, {
      y: 0,
      force3D: true,
      transformStyle: 'preserve-3d'
    });

    element.innerHTML = '';
    const chars = [];

    for (let i = 0; i < originalText.length; i++) {
      const span = document.createElement('span');
      span.className = 'char';
      Object.assign(span.style, {
        opacity: originalText[i] === ' ' ? '1' : '0',
        display: 'inline-block',
        verticalAlign: 'top',
        willChange: 'opacity, contents'
      });
      span.textContent = originalText[i] === ' ' ? '\u00A0' : originalText[i];
      element.appendChild(span);
      chars.push(span);
    }

    chars.forEach((span, i) => {
      if (originalText[i] === ' ') return;

      gsap.to(span, {
        opacity: 1,
        duration: 0.05,
        delay: i * 0.03,
        ease: 'none',
        onStart: () => {
          let counter = 0;
          const interval = setInterval(() => {
            span.textContent = lettersAndSymbols[Math.floor(Math.random() * lettersAndSymbols.length)];
            counter++;
            if (counter > 5) {
              clearInterval(interval);
              span.textContent = originalText[i];
            }
          }, 30);
        }
      });
    });
  };

  useEffect(() => {
    if (!isLoading && titleRef1.current && titleRef2.current) {
      // Initialize with fixed positions
      gsap.set([titleRef1.current, titleRef2.current], {
        y: 0,
        opacity: 0,
        visibility: 'hidden',
        display: 'inline-block'
      });

      setTitlesVisible(true);

      setTimeout(() => {
        // Animate first title
        applyShuffleEffect(titleRef1.current, "The Efficient OS");
        
        setTimeout(() => {
          // Animate second title
          applyShuffleEffect(titleRef2.current, "for your schedule");
          
          // Animate paragraphs after titles are done
          setTimeout(() => {
            const paragraphElements = document.querySelectorAll('.p-desc p');
            paragraphElements.forEach((p, index) => {
              if (phrases[index]) {
                // Make paragraph visible before animation
                gsap.set(p, {
                  visibility: 'visible',
                  opacity: 0,
                  y: 0
                });
                typewriterEffect(p, phrases[index], index * 0.3);
              }
            });
          }, 100); // Wait longer for paragraphs
        }); // Delay between titles
      }, 10);
    }
  }, [isLoading]);

  // ... (rest of the useEffect hooks for scroll and mouse move remain unchanged)

  return (
    <div className="relative">
      <DotPattern
        width={20}
        height={20}
        cx={1}
        cy={1}
        cr={0.6}
        className={cn(
          "[mask-image:linear-gradient(to_bottom_left,black,transparent,transparent)]",
        )}
      />
      <div className="starlight__header h-[470px] z-20 relative" id="home">
        {!isLoading && <Navbar className="navbar" />}

        <div className="icon top-left absolute" ref={iconRef}>
          <Image
            src="/assets/images/3dcirclefull.avif"
            alt="3D Icon"
            width={350}
            height={350}
            priority
            style={{ width: '100%', height: 'auto' }}
          />
        </div>

        <div className="wrapper md:px-6 px-2">
          <div className="starlight__header-content">
            <div className="head_title text-left text-white">
              <h1 
                ref={titleRef1} 
                className='-mb-4 title' 
                style={{ 
                  visibility: titlesVisible ? 'visible' : 'hidden',
                  opacity: titlesVisible ? 1 : 0,
                  transform: 'translateY(0)',
                  display: 'inline-block'
                }}
              />
              <h1 
                ref={titleRef2} 
                className='title' 
                style={{ 
                  visibility: titlesVisible ? 'visible' : 'hidden',
                  opacity: titlesVisible ? 1 : 0,
                  transform: 'translateY(0)',
                  display: 'inline-block'
                }}
              />
            </div>
            <div className="head_p mt-2 md:w-full md:text-left text-left">
              {phrases.map((phrase, index) => (
                <div key={index} className='p-desc'>
                  <p 
                    className="md:normal-case md:text-center text-center"
                    style={{
                      visibility: 'hidden',
                      opacity: 0
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;