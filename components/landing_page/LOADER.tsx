import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import "./loader.css";
import DotPattern from "../ui/dot-pattern";
import { cn } from "@/lib/utils";

const phrases = [
  "Streamline your appointments with ease",
  "Tailored to your needs, right on time",
];

const animation = {
  initial: { opacity: 0 },
  enter: (i) => ({
    opacity: 1,
    transition: {
      duration: 0.75,
      ease: "easeInOut",
      delay: 0.3 + 0.1 * i,
    },
  }),
  exit: {
    opacity: 0,
    transition: {
      duration: 0.55,
      ease: "easeInOut",
    },
  },
};

const LOADER = ({ onLoaderComplete }) => {
  const [counter, setCounter] = useState(0);
  const [showText, setShowText] = useState(true);
  const [loadingText, setLoadingText] = useState(""); // State pentru textul LOADING
  const [counterText, setCounterText] = useState("0%"); // State pentru counter
  
  const loadingBarRef = useRef(null);
  const loaderContainerRef = useRef(null);
  const textContainerRef = useRef(null);
  const counterRef = useRef(null);
  const phraseRefs = useRef([]);

  const loaderBackgroundColor = "#ffff";
  const rightOffset = '0.5rem';

  // Efect de "typewriter" care folosește React state
  const typewriterToState = (text, setState, delay = 0) => {
    const chars = text.split('');
    let currentIndex = 0;
    
    const typeNextChar = () => {
      if (currentIndex <= chars.length) {
        setState(chars.slice(0, currentIndex).join(''));
        currentIndex++;
        
        if (currentIndex <= chars.length) {
          setTimeout(typeNextChar, 35); // 35ms delay între caractere
        }
      }
    };
    
    setTimeout(typeNextChar, delay);
  };

  // Efect pentru typewriter pe fraze (păstrat pentru compatibilitate)
  const typewriterEffect = (element, text, delay = 0) => {
    if (!element || !text) return;

    element.innerHTML = '';
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
        duration: 0.35,
        delay: delay + (index * 0.02),
        ease: 'power1.inOut'
      });
    });
  };

  useEffect(() => {
    // Inițializează textul LOADING prin state
    typewriterToState("LOADING", setLoadingText, 300);

    // Animație pentru fraze
    phraseRefs.current.forEach((phrase, index) => {
      if (phrase && phrases[index]) {
        typewriterEffect(phrase, phrases[index], 0.3 + index * 0.1);
      }
    });

    const loadingInterval = setInterval(() => {
      setCounter(prev => {
        const newValue = prev < 100 ? prev + 2 : 100;
        
        // Actualizează counterText prin state în loc de manipulare DOM
        setCounterText(`${newValue}%`);

        if (newValue === 100) {
          clearInterval(loadingInterval);
          setShowText(false);

          const exitTimeline = gsap.timeline({
            onComplete: () => {
              gsap.to(loaderContainerRef.current, {
                opacity: 0,
                duration: 0.3,
                onComplete: onLoaderComplete
              });
            }
          });

          exitTimeline.to([textContainerRef.current, counterRef.current], {
            opacity: 0,
            duration: 0.45,
            ease: "power2.out"
          }, 0);

          const delayBeforeBarAnimation = Math.max(animation.exit.transition.duration, 0.45) + 0.1;

          exitTimeline.to(loadingBarRef.current, {
            height: "100vh",
            top: "0",
            bottom: "0",
            duration: 0.8,
            ease: "power4.out",
          }, delayBeforeBarAnimation);
        }

        return newValue;
      });
    }, 50);

    return () => clearInterval(loadingInterval);
  }, [onLoaderComplete]);

  // Efect pentru animația barei
  useEffect(() => {
    if (loadingBarRef.current && counterRef.current && textContainerRef.current) {
      const textWidth = textContainerRef.current.offsetWidth;
      const counterWidth = counterRef.current.offsetWidth;
      const initialWidth = textWidth + counterWidth + (parseFloat(rightOffset) * 2) + 50; // Buffer mărit

      const targetWidth = (counter / 100) * window.innerWidth;

      gsap.to(loadingBarRef.current, {
        width: counter === 0 ? initialWidth : targetWidth,
        left: 0,
        duration: 0.2,
        ease: "power1.out"
      });
    }
  }, [counter, rightOffset, loadingText, counterText]); // Adăugate dependințe pentru re-render

  return (
    <div
      ref={loaderContainerRef}
      className="fixed inset-0 flex flex-col items-center justify-center z-50"
      style={{ backgroundColor: loaderBackgroundColor }}
    >
      <DotPattern
        width={20}
        height={20}
        cx={1}
        cy={1}
        cr={0.6}
        className={cn(
          "absolute inset-0 opacity-30 [mask-image:linear-gradient(to_bottom_left,black,transparent,transparent)]"
        )}
      />

      <div className="phrases-container relative mb-6 flex flex-col gap-y-1 items-center">
        <AnimatePresence>
          {showText && phrases.map((phrase, index) => (
            <div key={phrase} className="relative">
              <motion.p
                ref={(el) => (phraseRefs.current[index] = el)}
                custom={index}
                initial="initial"
                animate="enter"
                exit="exit"
                variants={animation}
                className="p-desc load_p text-xl leading-[0.9] text-black text-center"
              />
            </div>
          ))}
        </AnimatePresence>
      </div>

      <div
        ref={loadingBarRef}
        className="absolute bg-black flex items-center justify-start px-4 overflow-hidden"
        style={{
          bottom: "0%",
          left: 0,
          height: "60px",
          width: "auto",
          justifyContent: 'space-between'
        }}
      >
        {/* Folosește state în loc de manipulare DOM */}
        <div 
          ref={textContainerRef} 
          className="loader-text font-bold whitespace-nowrap text-indigo-500"
          style={{ minHeight: '1em' }} // Previne colapsarea
        >
          {loadingText}
        </div>
        
        <div
          ref={counterRef}
          className="font-bold whitespace-nowrap text-indigo-500"
          style={{
            padding: '0 0.5rem',
            marginRight: rightOffset,
            minHeight: '1em' // Previne colapsarea
          }}
        >
          {counterText}
        </div>
      </div>
    </div>
  );
};

export default LOADER;