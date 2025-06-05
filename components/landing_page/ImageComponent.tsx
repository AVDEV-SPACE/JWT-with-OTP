'use client';
import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/image.css';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

const ImageComponent = () => {
  const containerRef1 = useRef(null);
  const containerRef2 = useRef(null);
  const containerRef3 = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (!containerRef1.current || !containerRef2.current || !containerRef3.current) return;

    // Adăugăm un fundal solid la fiecare container pentru a preveni transparența
    gsap.set([containerRef1.current, containerRef2.current, containerRef3.current], {
      backgroundColor: "#000", // Sau culoarea care se potrivește cu tema ta
    });

    // Primul container - adăugăm opacity pentru a-l face să dispară complet
    gsap.fromTo(
      containerRef1.current,
      { 
        scale: 1, 
        rotateZ: '0deg', 
        y: 0,
        opacity: 1, // Important: opacitate inițială completă
        zIndex: 3, 
        '--image-scale': 1 
      },
      {
        rotateZ: '10deg',
        scale: 0.6,
        y: 100,
        opacity: 0, // Facem elementul complet invizibil
        '--image-scale': 1.3,
        duration: 0.95,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef2.current,
          start: 'top 65%',
          end: 'top 20%', // Ajustăm pentru a se completa mai rapid tranziția
          scrub: 0.65,
        }
      }
    );

    // Al doilea container - la fel, adăugăm opacity
    gsap.fromTo(
      containerRef2.current,
      { 
        scale: 1, 
        rotateZ: '0deg', 
        y: 0,
        opacity: 1, // Important: opacitate inițială completă
        zIndex: 2, 
        '--image-scale': 1 
      },
      {
        rotateZ: '10deg',
        scale: 0.6,
        y: 100,
        opacity: 0, // Facem elementul complet invizibil
        '--image-scale': 1.3,
        duration: 0.95,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: containerRef3.current,
          start: 'top 65%',
          end: 'top 20%', // Ajustăm pentru a se completa mai rapid tranziția
          scrub: 0.65,
        }
      }
    );

    // Gestionarea z-index pentru a asigura stiva corectă
    ScrollTrigger.create({
      trigger: containerRef3.current,
      start: 'top 50%',
      onEnter: () => {
        // Setăm un z-index ridicat pentru containerul 3
        gsap.set(containerRef3.current, { zIndex: 10, immediateRender: false });
        
        // Setăm un z-index mai mic pentru containerele anterioare
        gsap.set(containerRef2.current, { zIndex: 3, immediateRender: false });
        gsap.set(containerRef1.current, { zIndex: 2, immediateRender: false });
      },
      onLeaveBack: () => {
        // Resetăm z-index-urile la ieșirea din viewport
        gsap.set(containerRef1.current, { zIndex: 3, immediateRender: false });
        gsap.set(containerRef2.current, { zIndex: 2, immediateRender: false });
        gsap.set(containerRef3.current, { zIndex: 1, immediateRender: false });
      },
    });

    // Curățăm toate instanțele ScrollTrigger la demontarea componentei
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section className='img_cont'>
      <div id='image-component'>
        <section id="image-sticky-wrap" ref={wrapperRef}>
          <div className="w-full">
            <div className="image-sticky image-sticky-1" ref={containerRef1}>
              <div className="wrap_sticky1 w-full">
                <Image src="/assets/images/dash1.png" alt="Dashboard 1" width={1200} height={800} style={{ objectFit: 'cover', height: '100%', transform: 'scale(var(--image-scale))' }} />
              </div>
            </div>

            <div className="image-sticky sticky22 image-sticky-2" ref={containerRef2}>
              <div className="wrap_sticky1 w-full">
                <Image src="/assets/images/2dash.png" alt="Dashboard 2" width={1200} height={800} style={{ objectFit: 'cover', height: '100%', transform: 'scale(var(--image-scale))' }} />
              </div>
            </div>

            <div className="image-sticky image-sticky-3" ref={containerRef3}>
              <div className="wrap_sticky1 w-full">
                <Image src="/assets/images/3dash.png" alt="Dashboard 3" width={1200} height={800} style={{ objectFit: 'cover', height: '100%', transform: 'scale(var(--image-scale))' }} />
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
};

export default ImageComponent;