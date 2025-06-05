"use client";
import React, { useEffect, useRef, useState } from "react";
import './chartstyles.css';
import { gsap } from 'gsap';
import { PendingChart } from "@/components/charts/PendingChart";
import { ScheduleChart } from "@/components/charts/ScheduleChart";
import { CancelChart } from "@/components/charts/CancelChart";
import { useRouter } from 'next/navigation';
import { getRecentAppointmentList } from "@/lib/actions/appointment.actions";
import NavbarDashboard from "@/components/landing_page/NavbarDashboard";
import DotPattern from "@/components/ui/dot-pattern";
import { cn } from "@/lib/utils";
import Lenis from "lenis";

const Statistics = () => {
    const filtersTitleRef = useRef(null); // Adaugă referința aici
  
    const lettersAndSymbols = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '!', '@', '#', '$', '%', '^', '&', '*', '-', '_', '+', '=', ';', ':', '<', '>', ','];
  
    const applyEffect8Animation = (element, originalText) => {
      if (!element) return;
  
      // Pregătim elementul
      element.innerHTML = '';
      const spans = [];
  
      // Creăm câte un span pentru fiecare caracter
      for (let i = 0; i < originalText.length; i++) {
          const span = document.createElement('span');
          span.classList.add('char');
  
          if (originalText[i] === ' ') {
              span.innerHTML = '&nbsp;';
          } else {
              span.style.opacity = '0';
              span.style.display = 'inline-block';
              span.textContent = originalText[i];
          }
          element.appendChild(span);
          spans.push(span);
      }
  
      // Calculăm și setăm lățimea elementului înainte de animație (adăugăm un buffer de 30px)
      requestAnimationFrame(() => {
          element.style.width = (element.offsetWidth + 30) + 'px';
          element.style.display = 'inline-block';
  
          // Acum animăm fiecare caracter
          spans.forEach((span, i) => {
              if (span.textContent !== '&nbsp;') {
                  gsap.fromTo(span,
                      { opacity: 0 },
                      {
                          duration: 0.03,
                          opacity: 1,
                          delay: (i + 1) * 0.18,
                          onStart: () => {
                              const shuffleChar = () => {
                                  span.textContent = lettersAndSymbols[Math.floor(Math.random() * lettersAndSymbols.length)];
                              };
                              const interval = setInterval(shuffleChar, 30);
                              setTimeout(() => {
                                  clearInterval(interval);
                                  span.textContent = originalText[i];
                              }, 300);
                          }
                      }
                  );
              }
          });
      });
  };
  
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
      const filtersTitleElement = filtersTitleRef.current;
  
      if (filtersTitleElement) {
        filtersTitleElement.style.whiteSpace = 'nowrap';
        applyEffect8Animation(filtersTitleElement, "Statistics");
      }
    }, []);

  useEffect(() => {
    const lenis = new Lenis();
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => {
      lenis.destroy();
    };
  }, []);

  const [appointments, setAppointments] = useState({
    scheduledCount: 0,
    pendingCount: 0,
    cancelledCount: 0,
  });

  useEffect(() => {
    const fetchAppointments = async () => {
      const data = await getRecentAppointmentList();
      setAppointments(data);
    };
    fetchAppointments();
  }, []);

  const chartConfig = {
    visitors: {
      label: "Visitors",
    },
    safari: {
      label: "Safari",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  // Function to get chart data with percentage
  const chartData = (count: number, label: string, total: number) => [
    { name: label, value: count, percentage: (count / total) * 100, fill: "var(--chart-2)" }
  ];

  const percentage = (count: number, total: number) => {
    if (total === 0) return '0';
    return ((count / total) * 100).toFixed(2);
  };

  const totalAppointments = appointments.scheduledCount + appointments.pendingCount + appointments.cancelledCount;

  const router = useRouter();

  const handleDashboardClick = () => {
    router.push('/admin');
  }

  const handleFiltersClick = () => {
    router.push('/admin/filters');
  };

  //* BAR H1 AND P ANIM 
  useEffect(() => {
    gsap.fromTo(
      '.stats_wrap h1',
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.admin-main h1',
          start: 'top center',
          end: 'bottom top',
          toggleActions: 'play none none reset',
        },
      }
    );

    gsap.fromTo(
      '.stats_wrap p',
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.admin-main p',
          start: 'top center',
          end: 'bottom top',
          toggleActions: 'play none none reset',
        },
      }
    );
  }, []);

  return (
    <div className="relative pages">
      {/* DotPattern pentru fundal */}
      <div className="mx-auto flex px-5 flex-col">
<DotPattern width={20} height={20} cx={1} cy={1} cr={0.6} className="opacity-50 z-0" />

        <NavbarDashboard />

        <div className="stats_wrap space-y-12">
          <section className='w-full h-[12f0px] -mt-3 text-left'>
          <div className="admin_titl">
              <h1 className="z-20 title leading-[1] font-normal tracking-tight">
                  <div className="absolute left-0" ref={filtersTitleRef}>Statistics</div>
              </h1>  
          </div>
            <p className='mt-2 mx-auto '>Overview for the past month</p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-2">
            <div className="col-span-1 lg:flex-2">
              <ScheduleChart appointments={appointments} />
            </div>
            <div className="col-span-1 lg:flex-1">
              <PendingChart appointments={appointments} />
            </div>
            <div className="w-full">
              <CancelChart appointments={appointments} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
