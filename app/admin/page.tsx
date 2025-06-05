"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { getRecentAppointmentList, updateAppointment } from "@/lib/actions/appointment.actions";
import { Appointment } from "@/types/appwrite.types";
import { DataTable } from "@/components/table/DataTable";
import { useRouter } from "next/navigation";
import StatCard from "@/components/StatCard";
import { columns } from "@/components/table/columns";
import gsap from "gsap";
import Lenis from "lenis";
import DotPattern from "@/components/ui/dot-pattern";
import { cn } from "@/lib/utils";
import NavbarDashboard from "@/components/landing_page/NavbarDashboard";
import { MdPersonSearch } from "react-icons/md";

interface AdminProps {
    isLoading: boolean;
}

const Admin: React.FC<AdminProps> = ({ isLoading }) => {
    const router = useRouter();
    const [appointments, setAppointments] = useState<{
        documents: Appointment[];
        scheduledCount: number;
        pendingCount: number;
        cancelledCount: number;
    } | null>(null);

    const [filteredAppointments, setFilteredAppointments] = useState<typeof appointments>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const welcomeTitleRef = useRef(null);

    const lettersAndSymbols = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '!', '@', '#', '$', '%', '^', '&', '*', '-', '_', '+', '=', ';', ':', '<', '>', ','];
// * TITTLE ANIMATION
    const applyEffect8Animation = (element, originalText) => {
        if (!element) return;

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
        
// * LENIS 
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

// * SEARCH 
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value;
        setSearchTerm(term);

        if (!appointments) return;

        if (!term.trim()) {
            setFilteredAppointments(appointments);
            setCurrentPage(0);
            return;
        }

        const searchTermLower = term.toLowerCase();
        const filtered = {
            ...appointments,
            documents: appointments.documents.filter(appointment => {
                const patientName = appointment.patient?.name?.toLowerCase() || '';
                const doctorName = appointment.primaryPhysician?.toLowerCase() || '';

                return patientName.includes(searchTermLower) || doctorName.includes(searchTermLower);
            })
        };

        setFilteredAppointments(filtered);
        setCurrentPage(0);
    };

//* USING THIS FUNCT TO KEEP / RENDER THE TABLE WITH THE CURRENT / UPDATED DATA  
    const handleAppointmentChange = async (appointmentData: any): Promise<Appointment | void> => {
        try {
            const updatedAppointment = await updateAppointment(appointmentData);

            setAppointments((prev) => {
                if (!prev) return null;

                const updatedDocuments = prev.documents.map((doc) => {
                    //* verificam daca ID-ul programarii curente din lista (doc) corespunde cu cel al programarii actualizate; r
                    //* returnam versiunea actualizata in caz afirmativ, altfel pe cea originala.
                    return doc.$id === updatedAppointment.$id ? updatedAppointment : doc;
                });

                const newScheduledCount = updatedDocuments.filter(
                    (appointment) => appointment.status === "scheduled"
                ).length;
                const newPendingCount = updatedDocuments.filter(
                    (appointment) => appointment.status === "pending"
                ).length;
                const newCancelledCount = updatedDocuments.filter(
                    (appointment) => appointment.status === "cancelled"
                ).length;

                const updatedAppointments = {
                    ...prev,
                    documents: updatedDocuments,
                    scheduledCount: newScheduledCount,
                    pendingCount: newPendingCount,
                    cancelledCount: newCancelledCount,
                };

                localStorage.setItem("appointments", JSON.stringify(updatedAppointments));
                setFilteredAppointments(updatedAppointments);
                return updatedAppointments;
            });

        } catch (err) {
            console.error("Error updating appointment:", err);
            throw err;
        }
    };

// * USING THE HOOK TO FETCH THE MOST RECENT APPOINTMENTS
    useEffect(() => {
        const storedAppointments = localStorage.getItem("appointments");
        if (storedAppointments) {
            const parsed = JSON.parse(storedAppointments);
            setAppointments(parsed);
            setFilteredAppointments(parsed);
        }

        const fetchAppointmentsInternal = async () => {
            try {
                const data = await getRecentAppointmentList();
                if (data) {
                    const typedData = {
                        ...data,
                        documents: data.documents as Appointment[],
                    };
                    setAppointments(typedData);
                    setFilteredAppointments(typedData);
                    localStorage.setItem("appointments", JSON.stringify(typedData));
                }
            } catch (error) {
                console.error("Error fetching appointments:", error);
            }
        };

        fetchAppointmentsInternal();
    }, []);

    const handleOpenModal = useCallback(
        (appointment: Appointment, type: "schedule" | "cancel" | "create") => {},
        []
    );

    const totalAppointments =
        (appointments?.scheduledCount ?? 0) +
        (appointments?.pendingCount ?? 0) +
        (appointments?.cancelledCount ?? 0);

    const percentage = (count: number) => {
        if (totalAppointments === 0) return "0";
        return ((count / totalAppointments) * 100).toFixed(2);
    };

// * TRIGGHER FOR H1 ANIM
    useEffect(() => {
        gsap.fromTo(
            ".admin-main h1",
            { opacity: 0, y: 50 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".admin-main h1",
                    start: "top center",
                    end: "bottom top",
                    toggleActions: "play none none reset",
                },
            }
        );

        const welcomeTitleElement = welcomeTitleRef.current;

        if (welcomeTitleElement) {
            welcomeTitleElement.style.whiteSpace = 'nowrap';
            applyEffect8Animation(welcomeTitleElement, "Welcome");
        }
    }, []);

// * MAKING SURE WE DON T HAVE UI BUGS BY STORING AND UPDATYING CHANGES
    const memoizedDataTable = React.useMemo(() => {
        if (!filteredAppointments?.documents || filteredAppointments.documents.length === 0) return null;

        return (
            <DataTable<Appointment>
                columns={columns(handleOpenModal, handleAppointmentChange)}
                data={filteredAppointments.documents}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />
        );
    }, [filteredAppointments?.documents, currentPage, handleOpenModal]);

    return (
        <div className="relative min-h-screen ">
            <DotPattern
                width={20}
                height={20}
                cx={1}
                cy={1}
                cr={0.6}
                className={cn(
                    "[mask-image:radial-gradient(600px_circle_at_center,white,transparent)] [mask-repeat:no-repeat] [mask-position:center] opacity-50 z-0"
                )}
            />

            <div className="relative mx-auto flex px-5 flex-col Admin_page">
                {!isLoading && <NavbarDashboard />}
{/* HEADER */}
                <section className="relative h-[120px] w-full text-left z-2 space-y-12 mt-28">
                    <div className="relative flex w-full justify-between items-start overflow-hidden rounded-lg">
                        <div>
                            <h1 className="z-20 title leading-[1] font-normal tracking-tight">
                                <div ref={welcomeTitleRef}>Welcome</div>
                            </h1>
                            <p className="z-20 mt-2 text-sm text-gray-600">Manage your appointments</p>
                        </div>

                        <div className="relative notifbrd_gradient2 bg-black/90 max-w-lg h-10 mt-5">
                            <input
                                type="text"
                                placeholder="Search patient or doctor"
                                value={searchTerm}
                                onChange={handleSearch}
                                className="px-4 py-2 pr-12 w-full  min-w-[250px] rounded-full bg-transparent text-white
                                placeholder-neutral-400 focus:outline-none focus:border-neutral-500"
                            />
                            <MdPersonSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 text-neutral-400" />
                        </div>
                    </div>

{/* TABLE DASH */}
                    <div className="relative z-10 pb-4 w-full">{memoizedDataTable}</div>


                </section>
            </div>
        </div>
    );
};

export default Admin;