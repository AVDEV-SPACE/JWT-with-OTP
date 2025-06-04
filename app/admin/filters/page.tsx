"use client";
import React, { useState, useEffect, useRef } from "react";
import { columnsfilters } from "@/components/table/columnsfilters";
import { getRecentAppointmentList } from "@/lib/actions/appointment.actions";
import NavbarDashboard from "@/components/landing_page/NavbarDashboard";
import { DataTable } from "@/components/table/DataTable";
import DotPattern from "@/components/ui/dot-pattern";
import StatFilter from "@/components/StatFilter";
import { MdPersonSearch } from "react-icons/md";
import Lenis from "lenis";
import { Skeleton } from "@/components/ui/skeleton";
import { gsap } from 'gsap'; // Import gsap aici

const Filters = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<"appointments" | "pending" | "cancelled" | null>(null);
  const [filteredAppointments, setFilteredAppointments] = useState<any[]>([]);
  const [allAppointments, setAllAppointments] = useState<any[]>([]);
  const [stats, setStats] = useState({ appointments: 0, pending: 0, cancelled: 0 });
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);


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
      applyEffect8Animation(filtersTitleElement, "Filters");
    }
  }, []);

const fetchAllAppointments = async () => {
  try {
    const data = await getRecentAppointmentList();
    return data.documents || [];
  } catch (error) {
    console.error("Failed to fetch appointments:", error);
    return [];
  }
};

  const calculateStats = (data: any[]) => {
    setStats({
      appointments: data.filter((appointment) => appointment.status === "scheduled").length,
      pending: data.filter((appointment) => appointment.status === "pending").length,
      cancelled: data.filter((appointment) => appointment.status === "cancelled").length,
    });
  };

  useEffect(() => {
    const fetchAndSetAppointments = async () => {
      setIsLoading(true);
      const data = await fetchAllAppointments();
      setAllAppointments(data);
      setFilteredAppointments(data);
      calculateStats(data);
      setIsLoading(false);
    };

    fetchAndSetAppointments();
  }, []);

  // Actualizăm funcția de filtrare pentru a păstra și searchTerm-ul activ
  const filterAppointments = (filterType: "appointments" | "pending" | "cancelled" | null) => {
    setActiveFilter(filterType);

    let filtered = [...allAppointments];

    // Aplicăm filtrul de status
    if (filterType) {
      filtered = filtered.filter((appointment) =>
        filterType === "appointments"
          ? appointment.status === "scheduled"
          : appointment.status === filterType
      );
    }

    // Aplicăm și search term-ul dacă există
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((appointment) => {
        const patientName = appointment.patient?.name?.toLowerCase() || '';
        const doctorName = appointment.primaryPhysician?.toLowerCase() || '';

        return patientName.includes(term) || doctorName.includes(term);
      });
    }

    setFilteredAppointments(filtered);
  };

  // Actualizăm handler-ul de search pentru a păstra și filtrul activ
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);

    let filtered = [...allAppointments];

    // Aplicăm mai întâi filtrul activ dacă există
    if (activeFilter) {
      filtered = filtered.filter((appointment) =>
        activeFilter === "appointments"
          ? appointment.status === "scheduled"
          : appointment.status === activeFilter
      );
    }

    // Apoi aplicăm termenul de căutare
    if (term) {
      const searchTermLower = term.toLowerCase();
      filtered = filtered.filter((appointment) => {
        const patientName = appointment.patient?.name?.toLowerCase() || '';
        const doctorName = appointment.primaryPhysician?.toLowerCase() || '';

        return patientName.includes(searchTermLower) || doctorName.includes(searchTermLower);
      });
    }

    setFilteredAppointments(filtered);
  };

  return (
  <div className="relative">
  <div className="mx-auto flex px-5 flex-col space-y-5 Filters_page">
    <DotPattern width={20} height={20} cx={1} cy={1} cr={0.6} className="opacity-50 z-0" />

    <main className="admin-main relative h-auto">
      <NavbarDashboard />

      <div className="space-y-12 w-full">
        <section className="relative h-[80px] -mt-8 w-full flex justify-between text-left z-10">
          <div className="relative flex w-full flex-col items-start">
              <h1 className="z-20 title leading-[1] font-normal tracking-tight">
                  <div className="absolute left-0" ref={filtersTitleRef}>Filters</div>
              </h1>         
               <p className="z-20 mt-2 text-sm text-gray-600">Filter your appointments</p>
          </div>

          <div className="relative notifbrd_gradient2 bg-black/90 max-w-2xl h-10 mt-5">
              <input
                  type="text"
                  placeholder="Search patient or doctor"
                  value={searchTerm}
                  onChange={handleSearch}
                  className="px-4 py-2 pr-12 w-full  min-w-[300px] rounded-full bg-transparent text-white
                  placeholder-neutral-400 focus:outline-none focus:border-neutral-500"
              />
              <MdPersonSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 text-neutral-400" />
          </div>
        </section>


        <section className="admin-stat">
              <StatFilter
                type="appointments"
                count={stats.appointments}
                label="Scheduled appointments"
                icon="/assets/icons/cardaction1.png"
                onClick={() => filterAppointments("appointments")}
              />
              <StatFilter
                type="pending"
                count={stats.pending}
                label="Pending appointments"
                icon="/assets/icons/cardaction2.png"
                onClick={() => filterAppointments("pending")}
              />
              <StatFilter
                type="cancelled"
                count={stats.cancelled}
                label="Cancelled appointments"
                icon="/assets/icons/cardaction4.png"
                onClick={() => filterAppointments("cancelled")}
              />
          </section>

            {isLoading ? (
              <div className="mt-5">
                <Skeleton className="w-full h-screen rounded-lg" />
              </div>
            ) : (
              <DataTable
                columns={columnsfilters}
                data={filteredAppointments}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Filters;