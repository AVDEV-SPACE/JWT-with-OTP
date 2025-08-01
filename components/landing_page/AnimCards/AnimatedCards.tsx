'use client';
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
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
      console.error("Cards or images missing:", { totalCards, imagesLength: images.length });
      return;
    }

    gsap.set(cards[0], { y: "0%", scale: 1, rotation: 0 });
    gsap.set(images[0], { scale: 1 });
    for (let i = 1; i < totalCards; i++) {
      gsap.set(cards[i], { y: "100%", scale: 1, rotation: 0 });
      gsap.set(images[i], { scale: 1 });
    }

    cards.forEach(card => {
      if (card) card.style.width = '100%'; // Forțează lățimea
      if (card) card.style.height = `${container.current!.offsetHeight}px`;
    });

    scrollTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: "top top",
        end: `+=${window.innerHeight * (totalCards - 1)}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        onUpdate: () => {
          cards.forEach(card => {
            if (card) {
              card.style.width = '100%';
              card.style.height = `${container.current!.offsetHeight}px`;
            }
          });
        },
      },
    });

    for (let i = 0; i < totalCards - 1; i++) {
      const position = i;
      scrollTimeline.to(cards[i], { scale: 0.7, rotation: 5, duration: 1, ease: "none" }, position)
        .to(images[i], { scale: 1.2, duration: 1, ease: "none" }, position)
        .to(cards[i + 1], { y: "0%", duration: 1, ease: "none" }, position);
    }

    const timeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    return () => {
      clearTimeout(timeout);
      scrollTimeline?.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div>
      <section className="sticky-cards" ref={container}>
        <div className="cards-container">
          <div className="card" ref={el => (cardsRef.current[0] = el || cardsRef.current[0])}>
            <Image
              className="img"
              src="/assets/images/dash1.png"
              alt="Dashboard 1"
              loading="lazy"
              width={1200} 
              height={800}
              ref={el => (imagesRef.current[0] = el || imagesRef.current[0])}
            />
          </div>
          <div className="card" ref={el => (cardsRef.current[1] = el || cardsRef.current[1])}>
            <Image
              className="img"
              src="/assets/images/2dash.png"
              alt="Dashboard 2"
              loading="lazy"
              width={1200} 
              height={800}
              ref={el => (imagesRef.current[1] = el || imagesRef.current[1])}
            />
          </div>
          <div className="card" ref={el => (cardsRef.current[2] = el || cardsRef.current[2])}>
            <Image
              className="img"
              src="/assets/images/3dash.png"
              alt="Dashboard 3"
              loading="lazy"
              width={1200} 
              height={800}
              ref={el => (imagesRef.current[2] = el || imagesRef.current[2])}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default AnimatedCards;