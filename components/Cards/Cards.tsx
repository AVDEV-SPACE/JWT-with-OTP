'use client';
import React, { useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ReactLenis } from 'lenis/react';
import './card.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const phrases1 = [
  "Make sure to pick a numeric combination and please",
  "make sure you don't share it. Use it once, and since",
  "you're verified, you have access to the dashboard.",
];

const phrases2 = [
  "Once you're in, you have access to all of our features.",
  "You can analyze or delegate based on your business",
  "needs. We could customize the features.",
];

const lettersAndSymbols = [
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
  '!', '@', '#', '$', '%', '^', '&', '*', '-', '_', '+', '=', ';', ':', '<', '>', ',',
];

const Card = () => {
  const containerRef = useRef(null);
  const containerRef1 = useRef(null);
  const containerRef2 = useRef(null);
  const containerRef3 = useRef(null);
  const phraseRefs1 = useRef([]);
  const phraseRefs2 = useRef([]);
  let scrollTimeline = null;

  const applyEffect8Animation = useCallback((element, originalText) => {
    if (!element) return;
    element.innerHTML = '';
    const spans = [];
    originalText.split('').forEach((char, i) => {
      const span = document.createElement('span');
      span.classList.add('char');
      span.style.opacity = char === ' ' ? '1' : '0';
      span.style.display = 'inline-block';
      span.textContent = char === ' ' ? '\u00A0' : char;
      element.appendChild(span);
      spans.push(span);
    });

    requestAnimationFrame(() => {
      element.style.width = element.offsetWidth + 'px';
      element.style.display = 'inline-block';
      const tl = gsap.timeline();
      spans.forEach((span, i) => {
        if (span.textContent !== '\u00A0') {
          tl.fromTo(
            span,
            { opacity: 0 },
            {
              duration: 0.03,
              opacity: 1,
              delay: i * 0.08,
              onStart: () => {
                const interval = setInterval(() => {
                  span.textContent = lettersAndSymbols[Math.floor(Math.random() * lettersAndSymbols.length)];
                }, 15);
                setTimeout(() => {
                  clearInterval(interval);
                  span.textContent = originalText[i];
                }, 300);
              },
            },
            0
          );
        }
      });
      tl.to({}, { onComplete: () => (element.textContent = originalText) });
    });
  }, []);

  const typewriterEffect = useCallback((element, text, delay = 0) => {
    if (!element || !text) return;
    element.innerHTML = '';
    element.style.visibility = 'visible';
    element.style.opacity = '1';
    text.split('').forEach((char, index) => {
      const span = document.createElement('span');
      span.classList.add('typing-char');
      span.style.opacity = '0';
      span.style.display = 'inline-block';
      span.style.verticalAlign = 'top';
      span.textContent = char === ' ' ? '\u00A0' : char;
      element.appendChild(span);
      gsap.to(span, { opacity: 1, duration: 0.05, delay: delay + (index * 0.03), ease: 'none' });
    });
  }, []);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .char, .typing-char { display: inline-block; will-change: contents, opacity; backface-visibility: hidden; }
      .p-desc h3 { visibility: hidden; opacity: 0; }
    `;
    document.head.appendChild(style);

    const cards = [containerRef1.current, containerRef2.current, containerRef3.current].filter(Boolean);
    const contents = cards.map(card => card.querySelector('.sitcky-content, .content_card'));
    const totalCards = cards.length;

    if (!totalCards || contents.length !== totalCards) {
      console.error('Carduri sau conținut lipsă:', { totalCards, contentsLength: contents.length });
      return;
    }

    gsap.set(cards[0], { y: '0%', scale: 1, rotation: 0 });
    gsap.set(contents[0], { scale: 1 });
    for (let i = 1; i < totalCards; i++) {
      gsap.set(cards[i], { y: '100%', scale: 1, rotation: 0 });
      gsap.set(contents[i], { scale: 1 });
    }

    scrollTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: `+=${window.innerHeight * (totalCards - 1)}`,
        pin: true,
        scrub: 0.5,
        invalidateOnRefresh: true,
      },
    });

    for (let i = 0; i < totalCards - 1; i++) {
      const position = i;
      scrollTimeline.to(cards[i], { scale: 0.5, rotation: 10, duration: 1, ease: 'none' }, position)
        .to(contents[i], { scale: 1.2, duration: 1, ease: 'none' }, position)
        .to(cards[i + 1], { y: '0%', duration: 1, ease: 'none' }, position);
    }

    // Text animations for containerRef1
    gsap.fromTo(
      containerRef1.current?.querySelector('.tit1'),
      { opacity: 0, visibility: 'hidden' },
      {
        opacity: 1,
        visibility: 'visible',
        duration: 0.8,
        scrollTrigger: {
          trigger: containerRef1.current,
          start: 'top center',
          end: 'top top',
          toggleActions: 'play none none reverse',
          onEnter: () => applyEffect8Animation(containerRef1.current.querySelector('.tit1'), "Create a password"),
        },
      }
    );

    phraseRefs1.current.forEach((phrase, index) => {
      if (phrase && phrases1[index]) {
        ScrollTrigger.create({
          trigger: containerRef1.current,
          start: 'top center',
          onEnter: () => typewriterEffect(phrase, phrases1[index], index * 0.1),
          once: true,
        });
      }
    });

    // Text animations for containerRef2
    gsap.fromTo(
      containerRef2.current?.querySelector('.tit2'),
      { opacity: 0, visibility: 'hidden' },
      {
        opacity: 1,
        visibility: 'visible',
        duration: 0.8,
        scrollTrigger: {
          trigger: containerRef1.current,
          start: 'bottom center',
          end: 'bottom top',
          toggleActions: 'play none none reverse',
          onEnter: () => applyEffect8Animation(containerRef2.current.querySelector('.tit2'), "Safely logged in"),
        },
      }
    );

    phraseRefs2.current.forEach((phrase, index) => {
      if (phrase && phrases2[index]) {
        ScrollTrigger.create({
          trigger: containerRef1.current,
          start: 'bottom center',
          onEnter: () => typewriterEffect(phrase, phrases2[index], index * 0.1),
          once: true,
        });
      }
    });

    return () => {
      document.head.removeChild(style);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      if (scrollTimeline) scrollTimeline.kill();
    };
  }, [applyEffect8Animation, typewriterEffect]);

  return (
    <ReactLenis root>
      <section className="sticky-cards" ref={containerRef}>
        <div className="cards-container">
          <div className="about-sticky about-sticky-1 card_brd_gradient1" ref={containerRef1}>
            <div className="wrap_sticky1 flex flex-col justify-center">
              <div className="sitcky-content flex justify-center items-start mb-6 gap-4 pb-6 slide1">
                <div className="div">
                  <div className="flex gap-6">
                    <h1 className="title whitespace-nowrap tit1 flex gap-2 items-center" data-text="Create a password" style={{ opacity: 0, visibility: 'hidden' }}>
                      Create a password
                    </h1>
                  </div>
                  <div className="flex flex-col">
                    {phrases1.map((phrase, index) => (
                      <div key={index} className="p-desc cards_p">
                        <div className="md:normal-case text-[1rem]" style={{ lineHeight: '1.25' }}>
                          <h3 ref={(el) => (phraseRefs1.current[index] = el)}>{phrase}</h3>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="about-sticky about-sticky-2 card_brd_gradient3" ref={containerRef2}>
            <div className="wrap_sticky1 flex flex-col justify-center">
              <div className="sitcky-content card_row2 flex items-start gap-4">
                <div className="div text-left mt-4">
                  <div className="flex gap-6">
                    <h1 className="title whitespace-nowrap tit2 flex gap-2 items-center" data-text="Safely logged in" style={{ opacity: 0, visibility: 'hidden' }}>
                      Safely logged in
                    </h1>
                  </div>
                  <div className="flex flex-col">
                    {phrases2.map((phrase, index) => (
                      <div key={index} className="p-desc cards_p">
                        <div className="md:normal-case text-[1rem]" style={{ lineHeight: '1.25' }}>
                          <h3 ref={(el) => (phraseRefs2.current[index] = el)}>{phrase}</h3>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="about-sticky about-sticky-3 notifbrd_gradient1" ref={containerRef3}>
            <div className="content_card">
              <div className="starlight__card-video">
                <video
                  className="video-elm"
                  src="/assets/images/OTP.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{ objectFit: 'cover', height: '100%', width: '100%' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </ReactLenis>
  );
};

export default Card;