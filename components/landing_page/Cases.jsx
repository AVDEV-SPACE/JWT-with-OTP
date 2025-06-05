'use client';
import React, { useEffect, useRef, useState } from 'react';
import './Cases.css';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const lettersAndSymbols = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '!', '@', '#', '$', '%', '^', '&', '*', '-', '_', '+', '=', ';', ':', '<', '>', ','];

const phrasesHeading = [
  "Scale-up planner allows you to move create seamlessly",
  "straight from your phone, browser, or tablets with a variety of functions."
];

const Cases = () => {
  const casesRef = useRef(null);
  const acTitle = useRef(null);
  const phraseRefs = useRef([]);
  const animatedElements = useRef(new Set());
  
  // New refs for current_features section
  const titleRef = useRef(null);
  const smsNotifTitleRef = useRef(null);
  const syncedSlotsTitleRef = useRef(null);
  const paragraphsRef = useRef([]);
  const containerRef = useRef(null);
  const linkImageRef = useRef(null);
  const [mouseCoords, setMouseCoords] = useState({ x: 0, y: 0 });
  const scrollTweens = useRef([]);

  // Shuffle effect for titles
  const applyShuffleEffect = (element, originalText) => {
    if (!element || !originalText) return;

    element.innerHTML = '';
    element.style.visibility = 'visible';
    element.style.opacity = '1';

    for (let i = 0; i < originalText.length; i++) {
      const span = document.createElement('span');
      span.classList.add('char');
      
      if (originalText[i] === ' ') {
        span.innerHTML = '\u00A0';
        element.appendChild(span);
        continue;
      }
      
      span.style.opacity = '0';
      span.textContent = lettersAndSymbols[Math.floor(Math.random() * lettersAndSymbols.length)];
      element.appendChild(span);
      
      gsap.fromTo(
        span, 
        { opacity: 0 },
        {
          duration: 0.03,
          opacity: 1,
          delay: (i + 1) * 0.06,
          onStart: () => {
            const shuffleChar = () => {
              span.textContent = lettersAndSymbols[Math.floor(Math.random() * lettersAndSymbols.length)];
            };
            
            const interval = setInterval(shuffleChar, 8);
            
            setTimeout(() => {
              clearInterval(interval);
              span.textContent = originalText[i];
            }, 300);
          }
        }
      );
    }
  };

  // Typing effect for paragraphs
  const typewriterEffect = (element, text, delay = 0) => {
    if (!element || !text) return;
    
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
      
      gsap.to(span, {
        opacity: 1,
        duration: 0.05,
        delay: delay + (index * 0.03),
        ease: 'none'
      });
    });
  };

  useEffect(() => {
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
      .char, .typing-char {
        display: inline-block;
        will-change: contents, opacity;
        backface-visibility: hidden;
      }
      .p-desc p {
        visibility: hidden;
        opacity: 0;
      }
      h1 {
        visibility: visible;
        opacity: 1;
      }
      .notif {
        will-change: transform;
      }
    `;
    document.head.appendChild(style);

    // Initialize paragraphs as hidden
    paragraphsRef.current.forEach(p => {
      if (p) {
        gsap.set(p, { visibility: 'hidden', opacity: 0 });
      }
    });

    // Main title animation (ac-title)
    ScrollTrigger.create({
      trigger: acTitle.current,
      start: "top 80%",
      onEnter: () => {
        if (!animatedElements.current.has(acTitle.current)) {
          const tl = gsap.timeline();
          
          tl.set(acTitle.current.querySelector('h1'), { visibility: 'visible', opacity: 1 })
            .add(() => {
              applyShuffleEffect(acTitle.current.querySelector('h1'), "Current features");
            });

          phraseRefs.current.forEach((phrase, index) => {
            if (phrase && phrasesHeading[index]) {
              const pElement = phrase.querySelector('p');
              if (pElement && !animatedElements.current.has(pElement)) {
                tl.add(() => {
                  typewriterEffect(pElement, phrasesHeading[index], 0);
                  gsap.to(pElement, { visibility: 'visible', duration: 0.1 });
                  animatedElements.current.add(pElement);
                }, `+=${index * 0.1}`);
              }
            }
          });

          animatedElements.current.add(acTitle.current);
        }
      },
      once: true,
      markers: false // Disable for production
    });

    // Title animations for current_features section
    const titles = [
      { ref: titleRef, text: "Keeping users updated" },
      { ref: smsNotifTitleRef, text: "Instant SMS Notifications" },
      { ref: syncedSlotsTitleRef, text: "Synced slots" }
    ];

    titles.forEach(({ ref, text }) => {
      if (ref.current) {
        ScrollTrigger.create({
          trigger: ref.current,
          start: "top 80%",
          onEnter: () => {
            if (!animatedElements.current.has(ref.current)) {
              applyShuffleEffect(ref.current, text);
              animatedElements.current.add(ref.current);
            }
          },
          once: true,
          markers: false // Disable for production
        });
      }
    });

    // Paragraph animations
    paragraphsRef.current.forEach((pElement, index) => {
      if (pElement) {
        const originalText = pElement.textContent;
        ScrollTrigger.create({
          trigger: pElement,
          start: "top 80%",
          onEnter: () => {
            if (!animatedElements.current.has(pElement)) {
              typewriterEffect(pElement, originalText, index * 0.1);
              animatedElements.current.add(pElement);
            }
          },
          once: true,
          markers: false // Disable for production
        });
      }
    });

    // Smooth scroll animation for 3dlink image
    if (linkImageRef.current) {
      const tween = gsap.to(linkImageRef.current, {
        y: -100,
        rotation: 180,
        scrollTrigger: {
          trigger: casesRef.current,
          start: "top center",
          end: "bottom top",
          scrub: 1,
          invalidateOnRefresh: true
        },
        ease: "power2.out"
      });
      scrollTweens.current.push(tween);
    }

    // Container scroll animation
    if (containerRef.current) {
      const img = containerRef.current.querySelector('.img-card');
      if (img) {
        gsap.set(img, { y: 0 });
        const tween = gsap.to(img, {
          y: "-40%",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top center",
            end: "bottom top",
            scrub: 1,
            invalidateOnRefresh: true
          },
          ease: "power3.out"
        });
        scrollTweens.current.push(tween);
      }
    }

    // Mouse move effect
    const handleMouseMove = (e) => {
      setMouseCoords({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.head.removeChild(style);
      
      // Clean up all ScrollTriggers and tweens
      scrollTweens.current.forEach(tween => tween.kill());
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  useEffect(() => {
    if (linkImageRef.current) {
      const rect = linkImageRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (mouseCoords.x - centerX) / 20;
      const deltaY = (mouseCoords.y - centerY) / 20;
      const rotationAmount = ((mouseCoords.x - centerX) / window.innerWidth) * 10;

      gsap.to(linkImageRef.current, {
        x: deltaX,
        y: deltaY,
        rotation: rotationAmount,
        duration: 1,
        ease: 'power2.out'
      });
    }
  }, [mouseCoords]);

  return (
    <div className="starlight__features" id="Cases" ref={casesRef}>
      <div className="">
        <div className="flex flex-col w-full head_cases">
          <div className="starlight__features-heading w-full text-left gap-2 py-5">
              <div className="nowrap ac-title" ref={acTitle}>
                <h1 
                  className="font-normal tracking-tight title leading-[0.9] text-white"
                  style={{ display: 'inline-block' }}
                >
                  {/* Text set dynamically via applyShuffleEffect */}
                </h1>
              </div>
              <div className="payment-heading mt-3 text-left">
                {phrasesHeading.map((phrase, index) => (
                  <div key={index} className="p-desc leading-[1.15]" ref={(el) => (phraseRefs.current[index] = el)}>
                    <p className="">{phrase}</p>
                  </div>
                ))}
              </div>
          </div>

          {/* Current Features Section */}
          <div className="flex flex-col md:flex-row gap-4 mb-4 w-full">
            {/* First row - Left card */}
            <div ref={containerRef} className="w-full md:w-1/2 relative overflow-hidden notif notifbrd_gradient1
              flex flex-col items-start justify-center gap-y-2 px-3 py-3">
              <h1 ref={titleRef} className="cards_tit ml-2 text-xl font-bold leading-[0.9] text-white">
                Keeping users updated
              </h1>
              <div className="ml-2 leading-[1.1] mt-2">
                {[
                  "We make sure your clients are in sync with you",
                  "anytime you schedule or act on the current",
                  "available features.",
                ].map((line, idx) => (
                  <p
                    key={idx}
                    ref={(el) => (paragraphsRef.current[idx] = el)}
                    className="text-left text-white"
                  >
                    {line}
                  </p>
                ))}
              </div>

              {/* <Image
                ref={linkImageRef}
                className="z-[-1] top-[10rem] -right-[9rem] absolute object-cover"
                src="/assets/images/3dlink.avif"
                height={250}
                width={200}
                alt="image"
                style={{ willChange: 'transform' }}
              /> */}
            </div>

            {/* First row - Right card */}
            <div className="w-full relative md:w-1/2 notif notifbrd_gradient2 overflow-hidden flex items-center gap-2 p-4">
              {/* Video */}
              <div className="w-9/12 md:w-[70%] h-[110%] s_slots relative top-4">
                <video
                  className="w-full h-full object-cover 
                  rounded-lg border_unv shadow-lg shadow-neutral-700"
                  src="/assets/images/Notif_1.mp4"
                  autoPlay
                  loop
                  muted
                  style={{ willChange: 'transform' }}
                ></video>
              </div>

              {/* Text aligned left + animated */}
              <div className="w-full md:w-7/12 text-left md:mr-8 mt-2 md:mt-0">
                <h1 ref={syncedSlotsTitleRef} className="text-left cards_tit text-xl font-bold text-white">
                  Synced slots
                </h1>
                <div className="slots leading-[1.1]">
                  {[
                    "Each time a dr. has a slot booked",
                    "that current spot it s taking out",
                    "available ones to avoid mistakes.",
                  ].map((line, idx) => (
                    <p
                      key={idx + 3}
                      ref={(el) => (paragraphsRef.current[idx + 3] = el)}
                      className="text-left text-white whitespace-nowrap"
                    >
                      {line}
                    </p>
                  ))}              
                </div>
              </div>
            </div>
          </div>

          {/* Second row - Full width card */}
          <div className="w-full relative notif notifbrd_gradient3 sms_notif_vid flex items-center px-4 overflow-hidden">
            {/* Text in left, aligned correct */}
            <div className="md:w-5/12 w-full text-left z-10">
              <h1 ref={smsNotifTitleRef} className="text-left cards_tit text-xl font-bold text-white">
                Instant SMS Notifications
              </h1>
              <div className="mt-[0.4rem] leading-[1.1]">
                {[
                  "Users receive an SMS instantly whenever",
                  "an admin accepts, modifies, or updates",
                  "a scheduled meeting. This ensures",
                  "real-time communication and keeps",
                  "everyone in sync.",
                ].map((line, idx) => (
                  <p
                    key={idx + 6}
                    ref={(el) => (paragraphsRef.current[idx + 6] = el)}
                    className="text-left text-white"
                  >
                    {line}
                  </p>
                ))}
              </div>
            </div>

            {/* Phone image */}
            <div className="relative md:w-[70%] md:h-[90%] w-[100%]">
              <video
                className="sms_notif z-10 md:w-[65%] md:h-5/12 md:top-[2rem] top-[1rem] object-cover rounded-2xl rotate-[70deg]"
                src="/assets/images/SMS.mp4"
                autoPlay
                loop
                muted
                style={{ willChange: 'transform' }}
              ></video>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cases;