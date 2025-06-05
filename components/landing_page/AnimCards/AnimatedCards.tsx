'use client';
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
// Comentăm ReactLenis temporar pentru testare
// import { ReactLenis } from 'lenis/react';
import './anim_cards.css';
import Image from 'next/image';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const AnimatedCards: React.FC = () => {
  const container = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  let scrollTimeline: gsap.core.Timeline | null = null;

  useEffect(() => {
    if (!container.current) return;

    const cards = cardsRef.current.filter(Boolean);
    const images = imagesRef.current.filter(Boolean);
    const totalCards = cards.length;

    if (!totalCards || images.length !== totalCards) {
      console.error("Carduri sau imagini lipsă:", { totalCards, imagesLength: images.length });
      return;
    }

    // Inițializare stări
    gsap.set(cards[0], { y: "0%", scale: 1, rotation: 0 });
    gsap.set(images[0], { scale: 1 });
    for (let i = 1; i < totalCards; i++) {
      gsap.set(cards[i], { y: "100%", scale: 1, rotation: 0 });
      gsap.set(images[i], { scale: 1 });
    }

    // Configurare animație optimizată
    scrollTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: "top top",
        end: `+=${window.innerHeight * (totalCards - 1)}`,
        pin: true,
        scrub: 1, // Creștem la 1 pentru a reduce frecvența de update
        anticipatePin: 1, // Reduce jitter-ul cu pinning
        invalidateOnRefresh: true,
      },
    });

    for (let i = 0; i < totalCards - 1; i++) {
      const position = i;
      scrollTimeline.to(cards[i], { scale: 0.7, rotation: 5, duration: 1, ease: "none" }, position) // Reducem intensitatea animației
        .to(images[i], { scale: 1.2, duration: 1, ease: "none" }, position) // Reducem scala maximă
        .to(cards[i + 1], { y: "0%", duration: 1, ease: "none" }, position);
    }

    return () => {
      scrollTimeline?.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    // Testăm fără ReactLenis temporar
    <div>
      <section className="sticky-cards" ref={container}>
        <div className="cards-container">
          <div className="card" ref={el => (cardsRef.current[0] = el || cardsRef.current[0])}>
            <Image
              className="img"
              src="/assets/images/dash1.png"
              alt="Dashboard 1"
              width={1200}
              height={800}
              loading="lazy" // Adăugăm lazy-loading pentru imagini
              style={{ objectFit: 'cover', height: '100%' }}
              ref={el => (imagesRef.current[0] = el || imagesRef.current[0])}
            />
          </div>
          <div className="card" ref={el => (cardsRef.current[1] = el || cardsRef.current[1])}>
            <Image
              className="img"
              src="/assets/images/2dash.png"
              alt="Dashboard 2"
              width={1200}
              height={800}
              loading="lazy"
              style={{ objectFit: 'cover', height: '100%' }}
              ref={el => (imagesRef.current[1] = el || imagesRef.current[1])}
            />
          </div>
          <div className="card" ref={el => (cardsRef.current[2] = el || cardsRef.current[2])}>
            <Image
              className="img"
              src="/assets/images/3dash.png"
              alt="Dashboard 3"
              width={1200}
              height={800}
              loading="lazy"
              style={{ objectFit: 'cover', height: '100%' }}
              ref={el => (imagesRef.current[2] = el || imagesRef.current[2])}
            />
          </div>
        </div>
      </section>
    </div>
    // <ReactLenis root> {/* Decomentăm dacă e necesar după testare */}
    //   <section className="sticky-cards" ref={container}>
    //     <div className="cards-container">
    //       <div className="card" ref={el => (cardsRef.current[0] = el || cardsRef.current[0])}>
    //         <Image
    //           className="img"
    //           src="/assets/images/dash1.png"
    //           alt="Dashboard 1"
    //           width={1200}
    //           height={800}
    //           loading="lazy"
    //           style={{ objectFit: 'cover', height: '100%' }}
    //           ref={el => (imagesRef.current[0] = el || imagesRef.current[0])}
    //         />
    //       </div>
    //       <div className="card" ref={el => (cardsRef.current[1] = el || cardsRef.current[1])}>
    //         <Image
    //           className="img"
    //           src="/assets/images/2dash.png"
    //           alt="Dashboard 2"
    //           width={1200}
    //           height={800}
    //           loading="lazy"
    //           style={{ objectFit: 'cover', height: '100%' }}
    //           ref={el => (imagesRef.current[1] = el || imagesRef.current[1])}
    //         />
    //       </div>
    //       <div className="card" ref={el => (cardsRef.current[2] = el || cardsRef.current[2])}>
    //         <Image
    //           className="img"
    //           src="/assets/images/3dash.png"
    //           alt="Dashboard 3"
    //           width={1200}
    //           height={800}
    //           loading="lazy"
    //           style={{ objectFit: 'cover', height: '100%' }}
    //           ref={el => (imagesRef.current[2] = el || imagesRef.current[2])}
    //         />
    //       </div>
    //     </div>
    //   </section>
    // </ReactLenis>
  );
};

export default AnimatedCards;