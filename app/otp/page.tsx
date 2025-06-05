'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import DotPattern from '@/components/ui/dot-pattern';
import { cn } from '@/lib/utils';

// Încărcare dinamică pentru a reduce recompilările
const Navbar = dynamic(() => import('@/components/landing_page/Navbar'));
const Cards = dynamic(() => import('@/components/Cards/Cards'));
const Footer = dynamic(() => import('@/components/landing_page/Footer/Footer'));

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Otp() {
  const router = useRouter();
  const [allowScroll, setAllowScroll] = useState(false);

  useEffect(() => {
    const lenis = new Lenis();
    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  const handleManualScroll = useCallback(() => {
    setAllowScroll(true);
    const scrollTimer = setTimeout(() => setAllowScroll(false), 1000);
    return () => clearTimeout(scrollTimer);
  }, []);

  return (
    <div className="relative min-h-screen pages">
      <DotPattern
        width={20}
        height={20}
        cx={1}
        cy={1}
        cr={0.5}
        className={cn(
          '[mask-image:linear-gradient(to_bottom_left,black,transparent,transparent)]',
          'absolute top-0 left-0 w-full h-full z-[-1]'
        )}
      />
      <div id="otp" onScroll={handleManualScroll} className="relative">
        <div data-scroll-container>
          <div className="mx-auto min-h-screen">
            <Navbar />
            <div className="mt-40">
              <Cards />
            </div>
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}