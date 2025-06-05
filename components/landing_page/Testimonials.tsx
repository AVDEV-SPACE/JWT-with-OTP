'use client';
import React, { useEffect, useRef, useCallback, useState, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaCircleUser } from "react-icons/fa6";
import '../styles/testimonials.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const lettersAndSymbols = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '!', '@', '#', '$', '%', '^', '&', '*', '-', '_', '+', '=', ';', ':', '<', '>', ','];

const testimonials = [
  { text: "Tailor your approach to fit your unique needs. Enjoy the flexibility of customizing tasks across various platforms and enhance your process.", name: "Abigal", username: "jeniesabigal" },
  { text: "Monitor pending transactions and send or receive physical checks efficiently. Stay updated on payment statuses and manage your financial activities with ease.", name: "Paul Stef", username: "Stefanesc@11" },
  { text: "Quickly cancel unwanted transactions to avoid errors or fraud. Ensure your funds remain secure and maintain full control over your financial activities.", name: "Ellen Steph", username: "steph-acc" },
  { text: "Tailor your approach to fit your unique needs. Enjoy the flexibility of customizing tasks across various platforms and enhance your process.", name: "Aman Orely", username: "orley-ost" },
  { text: "Tailor your approach to fit your unique needs. Enjoy the flexibility of customizing tasks across various platforms and enhance your process.", name: "John Max", username: "maxat_joe" },
  { text: "Monitor pending transactions and send or receive physical checks efficiently. Stay updated on payment statuses and manage your financial activities with ease.", name: "Hillie Ester", username: "ester98me" },
  { text: "Quickly cancel unwanted transactions to avoid errors or fraud. Ensure your funds remain secure and maintain full control over your financial activities.", name: "Yorn George", username: "gerorge" },
  { text: "Tailor your approach to fit your unique needs. Enjoy the flexibility of customizing tasks across various platforms and enhance your process.", name: "Liam Kob", username: "kob-tmn26" },
  { text: "Tailor your approach to fit your unique needs. Enjoy the flexibility of customizing tasks across various platforms and enhance your process.", name: "Alexandra Lup", username: "lup-ale" },
  { text: "Monitor pending transactions and send or receive physical checks efficiently. Stay updated on payment statuses and manage your financial activities with ease.", name: "Bob Remus", username: "remus@bike" },
  { text: "Quickly cancel unwanted transactions to avoid errors or fraud. Ensure your funds remain secure and maintain full control over your financial activities.", name: "Killian Ubuntu", username: "ubunt,alex" },
  { text: "Tailor your approach to fit your unique needs. Enjoy the flexibility of customizing tasks across various platforms and enhance your process.", name: "Emilia Rotar", username: "butanriu98" },
];

const TestimonialsColumn = ({ className, cardClass, testimonials }) => (
  <div className={className}>
    <div className="flex flex-col gap-5 pb-6 animate-scroll">
      {[...new Array(2)].fill(0).map((_, index) => (
        <React.Fragment key={index}>
          {testimonials.map(({ text, name, username }, idx) => (
            <div key={`${index}-${idx}`} className={`testimonial-card relative rounded-lg px-2 py-2 transition-colors duration-500 ${cardClass}`}>
              <div><p>{text}</p></div>
              <div className='flex items-center gap-2 mt-5 ml-2 text-white'>
                <FaCircleUser className="text-2xl" />
                <div className="flex flex-col ml-3">
                  <div className="font-medium tracking-tight leading-5">{name}</div>
                  <div className="tracking-tight leading-5">{username}</div>
                </div>
              </div>
            </div>
          ))}
        </React.Fragment>
      ))}
    </div>
  </div>
);

const Testimonials = () => {
  const testSection = useRef(null);
  const titleRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  const applyShuffleEffect = useCallback((element, originalText) => {
    if (!element || !originalText) return;

    // Ascundem elementul inițial
    gsap.set(element, { visibility: 'hidden', opacity: 0 });

    element.innerHTML = '';
    element.style.display = 'flex'; // Flex pentru spațiere între cuvinte
    element.style.gap = '0.7rem'; // Distanță între cuvinte

    const words = originalText.split(' ');
    words.forEach((word, wordIndex) => {
      const wordSpan = document.createElement('span');
      wordSpan.style.display = 'inline-block';
      wordSpan.style.whiteSpace = 'nowrap'; // Păstrează literele compacte în cuvânt

      for (let i = 0; i < word.length; i++) {
        const charSpan = document.createElement('span');
        charSpan.classList.add('char');
        charSpan.style.opacity = '0';
        charSpan.textContent = lettersAndSymbols[Math.floor(Math.random() * lettersAndSymbols.length)];
        wordSpan.appendChild(charSpan);

        gsap.fromTo(
          charSpan,
          { opacity: 0 },
          {
            duration: 0.03,
            opacity: 1,
            delay: (wordIndex * word.length + i + 1) * 0.06,
            onStart: () => {
              const shuffleChar = () => {
                charSpan.textContent = lettersAndSymbols[Math.floor(Math.random() * lettersAndSymbols.length)];
              };
              const interval = setInterval(shuffleChar, 8);
              setTimeout(() => {
                clearInterval(interval);
                charSpan.textContent = word[i];
              }, 300);
            },
            onComplete: () => {
              if (wordIndex === words.length - 1 && i === word.length - 1) {
                gsap.to(element, { visibility: 'visible', opacity: 1, duration: 0.1 }); // Arată titlul doar după animație
              }
            }
          }
        );
      }
      element.appendChild(wordSpan);
    });
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const firstColumn = useMemo(() => testimonials.slice(0, 4), []);
  const secondColumn = useMemo(() => testimonials.slice(4, 8), []);
  const thirdColumn = useMemo(() => testimonials.slice(8, 12), []);
  const allTestimonials = useMemo(() => [...firstColumn, ...secondColumn, ...thirdColumn], [firstColumn, secondColumn, thirdColumn]);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .animate-scroll {
        animation: scroll 14s linear infinite;
      }
      @keyframes scroll {
        0% { transform: translateY(0); }
        100% { transform: translateY(-50%); }
      }
      .char {
        display: inline-block;
        margin: 0; /* Elimină orice spațiere suplimentară */
        letter-spacing: normal; /* Asigurăm spațiere implicită */
      }
    `;
    document.head.appendChild(style);

    ScrollTrigger.create({
      trigger: testSection.current,
      start: "top 80%",
      toggleActions: 'play none none reset',
      onEnter: () => {
        if (titleRef.current) {
          applyShuffleEffect(titleRef.current, "Our users");
        }
      },
    });

    return () => {
      document.head.removeChild(style);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [applyShuffleEffect]);

  return (
    <section>
      <div>
        <div className="flex flex-col testimonial_header items-start relative left-0 text-left" ref={testSection}>
          <div className="testimonial_title">
            <h1 ref={titleRef} className="test_title title testimonial_title font-normal tracking-tight"></h1>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-center mt-16 w-full gap-6 [mask-image:linear-gradient(to_bottom,transparent,black,black,transparent)] max-h-[700px] overflow-hidden">
          {isMobile ? (
            <TestimonialsColumn testimonials={allTestimonials} cardClass="notifbrd_gradient1" />
          ) : (
            <>
              <TestimonialsColumn testimonials={firstColumn} cardClass="notifbrd_gradient2" />
              <TestimonialsColumn testimonials={secondColumn} cardClass="notifbrd_gradient2" />
              <TestimonialsColumn testimonials={thirdColumn} cardClass="notifbrd_gradient2" />
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;