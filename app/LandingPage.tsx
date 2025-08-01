'use client';
import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import Navbar from '@/components/landing_page/Navbar';
import Header from '@/components/landing_page/Header/Header';
import Cases from '@/components/landing_page/Cases';
import Notifications from '@/components/landing_page/Notificatons';
import AnimatedCards from '@/components/landing_page/AnimCards/AnimatedCards';
import Testimonials from '@/components/landing_page/Testimonials';
import Footer from '@/components/landing_page/Footer/Footer';
import LOADER from '@/components/landing_page/LOADER';




gsap.registerPlugin(ScrollTrigger);

export default function LandingPage({
  searchParams,
  isLoading,
  onLoaderComplete,
}: {
  searchParams: any;
  isLoading: boolean;
  onLoaderComplete: () => void;
}) {
  const [isLoaderComplete, setIsLoaderComplete] = useState(false);
  const imageComponentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoading) {
      setIsLoaderComplete(true);
    }
  }, [isLoading]);

  useEffect(() => {
    const lenis = new Lenis();
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => {
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    if (!imageComponentRef.current) return;

    // Eliminăm pin: true pentru a evita conflictul cu AnimatedCards
    gsap.to(imageComponentRef.current, {
      yPercent: -50, // Ajustăm pentru a muta mai puțin agresiv
      ease: 'none',
      scrollTrigger: {
        trigger: imageComponentRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="">
      {isLoading && (
        <LOADER
          onLoaderComplete={() => {
            onLoaderComplete();
            setIsLoaderComplete(true);
          }}
        />
      )}

      {isLoaderComplete && (
        <div data-scroll-container>
          <div className="mx-auto min-h-screen">
            {isLoaderComplete && <Navbar />}
            <Header isLoading={undefined} />
            <div className="home_pg space-y-12">

              <div className="feat_notif space-y-4">
                <div id="Cases">
                  <Cases />
                </div>
                <Notifications />
              </div>
              
              <div ref={imageComponentRef}>
                <AnimatedCards />
              </div>
              <Testimonials />
            </div>
          </div>
          <Footer />
        </div>
      )}
    </div>
  );
}