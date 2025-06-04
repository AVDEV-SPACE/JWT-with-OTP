'use client';
import React, { useState, useEffect } from 'react';
import LandingPage from './LandingPage';

export default function MainPage({ searchParams }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loaderShown = sessionStorage.getItem('loaderShown');
    if (loaderShown) {
      setIsLoading(false);
    }
    window.scrollTo(0, 0);
  }, []);

  const handleLoaderComplete = () => {
    requestAnimationFrame(() => {
      setIsLoading(false);
      sessionStorage.setItem('loaderShown', 'true');
    });
  };

  return (
    <>
      <div className="app" data-scroll-container>
        <LandingPage isLoading={isLoading} onLoaderComplete={handleLoaderComplete} />
      </div>
    </>
  );
}