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
      duration: 0.55, // Durata animației de ieșire pentru fraze
      ease: "easeInOut",
    },
  },
};

const LOADER = ({ onLoaderComplete }) => {
  const [counter, setCounter] = useState(0);
  const [showText, setShowText] = useState(true); // Controlează vizibilitatea frazelor (AnimatePresence)
  const loadingBarRef = useRef(null);
  const loaderContainerRef = useRef(null);
  const textContainerRef = useRef(null); // Ref pentru textul "LOADING"
  const counterRef = useRef(null); // Ref pentru procent
  const phraseRefs = useRef([]); // Ref-uri pentru elementele frazelor
  const previousCounterText = useRef("0%"); // Stochează textul anterior al contorului

  const loaderBackgroundColor = "#ffff";
  const rightOffset = '0.5rem';

  // Efect de "typewriter" îmbunătățit
  const typewriterEffect = (element, text, delay = 0, animateAll = true, previousText = "") => {
    if (!element || !text) return;

    element.innerHTML = '';

    const chars = text.split('');
    const prevChars = previousText.split('');

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

      // Nu anima caracterele care nu s-au schimbat (dacă nu animăm totul)
      if (!animateAll && index < prevChars.length && char === prevChars[index]) {
        span.style.opacity = '1'; // Menține caracterele neschimbate vizibile
      } else {
        gsap.to(span, {
          opacity: 1,
          duration: 0.35,
          delay: delay + (index * 0.02),
          ease: 'power1.inOut'
        });
      }
    });
  };

  useEffect(() => {
    // Animație pentru textul "LOADING" la început
    if (textContainerRef.current) {
      typewriterEffect(textContainerRef.current, "LOADING", 0.3, true);
    }

    // Animație pentru fraze la început
    phraseRefs.current.forEach((phrase, index) => {
      if (phrase && phrases[index]) {
        // Typewriter effect for initial appearance
        // We'll rely on Framer Motion's exit for disappearance
         typewriterEffect(phrase, phrases[index], 0.3 + index * 0.1, true);
      }
    });


    const loadingInterval = setInterval(() => {
      setCounter(prev => {
        const newValue = prev < 100 ? prev + 2 : 100;
        const newCounterText = `${newValue}%`;

        // Actualizează textul contorului cu efect typewriter, păstrând caracterele neschimbate
        if (counterRef.current) {
          typewriterEffect(counterRef.current, newCounterText, 0, false, previousCounterText.current);
          previousCounterText.current = newCounterText; // Actualizează textul anterior
        }

        if (newValue === 100) {
          clearInterval(loadingInterval);

          // Inițiază procesul de ieșire
          // Ascunde frazele (Framer Motion gestionează animația de ieșire)
          setShowText(false);

          // Creează o linie de timp GSAP pentru a secvența animațiile de ieșire
          const exitTimeline = gsap.timeline({
             // Această funcție se apelează la finalul întregii linii de timp
            onComplete: () => {
                // La finalul animației barei, fade out întregul container loader
                gsap.to(loaderContainerRef.current, {
                    opacity: 0,
                    duration: 0.3,
                    onComplete: onLoaderComplete // Apelează funcția de finalizare a loader-ului
                });
            }
          });

          // 1. Fade out textul "LOADING" și contorul
          // Folosim un singur .to pentru a le anima simultan
          exitTimeline.to([textContainerRef.current, counterRef.current], {
              opacity: 0,
              duration: 0.45, // Durata fade out-ului textelor
              ease: "power2.out"
          }, 0); // Începe la momentul 0 al liniei de timp

          // Determină întârzierea înainte de a anima bara
          // Ținem cont de durata fade out-ului textelor (și implicit a frazelor via setShowText(false))
          // Durata exit a frazelor este 0.55s. Durata fade out text/counter este 0.45s.
          // Vom aștepta durata cea mai lungă (frazele) + un mic buffer.
          const delayBeforeBarAnimation = Math.max(animation.exit.transition.duration, 0.45) + 0.1; // Așteaptă fade out-ul + 100ms buffer

          // 2. Animația barei (după ce textele și frazele au dispărut)
          exitTimeline.to(loadingBarRef.current, {
              height: "100vh", // Animează înălțimea la înălțimea viewport-ului
              top: "0",       // Setează top la 0
              bottom: "0",    // Setează bottom la 0 pentru a se întinde pe verticală
              duration: 0.8,
              ease: "power4.out",
               // onComplete-ul acestei animații va declanșa onComplete-ul liniei de timp `exitTimeline`
          }, delayBeforeBarAnimation); // Începe această animație după întârzierea calculată


          // Elimină vechiul setTimeout care gestiona animația barei
          // setTimeout(() => { ... }, 700); // <-- ACESTA SE ELIMINĂ
        }

        return newValue;
      });
    }, 50);

    return () => clearInterval(loadingInterval);
  }, [onLoaderComplete]); // Adăugat onLoaderComplete ca dependență

  // Efect pentru a anima lățimea barei pe măsură ce contorul crește
  // ACEST EFECT RĂMÂNE PENTRU ANIMAȚIA BAREI DE PROGRES PE ORIZONTALĂ
  useEffect(() => {
    if (loadingBarRef.current && counterRef.current && textContainerRef.current) {
      // Această logică pare să calculeze lățimea inițială a barei (când e 0%)
      // pe baza lățimii textului "LOADING" și a contorului.
      const textWidth = textContainerRef.current.offsetWidth;
      const counterWidth = counterRef.current.offsetWidth;
      // Ajustează calculul lățimii inițiale dacă este necesar
      // Probabil ține cont de padding-ul din bară și marginea dreaptă
      const initialWidth = textWidth + (counterRef.current.style.paddingLeft ? parseFloat(counterRef.current.style.paddingLeft) : 0) + (counterRef.current.style.paddingRight ? parseFloat(counterRef.current.style.paddingRight) : 0) + counterWidth + (parseFloat(rightOffset) * 2) + (parseFloat(loadingBarRef.current.style.paddingLeft) || 0) + (parseFloat(loadingBarRef.current.style.paddingRight) || 0) + 6; // Adăugat un buffer suplimentar de 6px

      // Lățimea țintă pe măsură ce crește progresul (până la 100%)
      // Această animație orizontală rulează *în timpul* încărcării, nu la final.
      const targetWidth = (counter / 100) * window.innerWidth; // Bara acoperă ecranul pe lățime la 100%

      gsap.to(loadingBarRef.current, {
        // Când counter-ul e 0, folosește lățimea inițială calculată, altfel folosește lățimea proporțională cu progresul.
        width: counter === 0 ? initialWidth : targetWidth,
        left: 0, // Asigură că bara începe mereu de la stânga
        duration: 0.2, // Durata animației de lățime
        ease: "power1.out"
      });
    }
  }, [counter, rightOffset]); // Adăugat rightOffset ca dependență

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

      {/* Container pentru fraze - gestionat de AnimatePresence și showText */}
      <div className="phrases-container relative mb-6 flex flex-col gap-y-1 items-center">
        <AnimatePresence>
          {/* Frazele sunt randate doar dacă showText este true */}
          {showText && phrases.map((phrase, index) => (
            <div key={phrase} className="relative">
              <motion.p
                ref={(el) => (phraseRefs.current[index] = el)}
                // Animația de intrare/ieșire Framer Motion este configurată în `animation`
                // Animația `enter` se aplică la mount dacă showText e true
                // Animația `exit` se aplică când showText devine false și componenta iese
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

      {/* Bara de încărcare - conține textul "LOADING" și contorul */}
      <div
        ref={loadingBarRef}
        className="absolute bg-black flex items-center justify-start px-4 overflow-hidden"
         // Stilurile inițiale ale barei (bottom 0, height fixă)
        style={{
          bottom: "0%",
          left: 0, // Asigură că începe de la stânga
          height: "60px",
          width: "auto", // Lățimea va fi setată de useEffect-ul pentru counter
          // Folosim justify-content space-between pentru a separa textul și contorul
          justifyContent: 'space-between'
        }}
      >
         {/* Textul "LOADING" - conținutul e setat de typewriterEffect */}
        <div ref={textContainerRef} className="loader-text font-bold whitespace-nowrap text-indigo-500" />
         {/* Contorul - conținutul e setat de typewriterEffect */}
        <div
          ref={counterRef}
          className="font-bold whitespace-nowrap text-indigo-500"
          style={{
            padding: '0 0.5rem', // Spațiu în jurul procentului
            marginRight: rightOffset // Margine dreapta ajustabilă
          }}
        />
      </div>
    </div>
  );
};

export default LOADER;