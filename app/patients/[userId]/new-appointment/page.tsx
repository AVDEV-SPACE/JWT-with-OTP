'use client'
import Image from "next/image";
import { getPatient } from "@/lib/actions/patient.actions";
import * as Sentry from '@sentry/nextjs';
import AppointmentForm from "@/components/forms/AppointmentForm";
import Link from "next/link";
import { useCallback, useState, useEffect } from "react";

const fetchPatient = async (userId: string) => {
  const patient = await getPatient(userId);
  return patient;
};

const Appointment = ({ params: { userId } }: SearchParamProps) => {
  const [patient, setPatient] = useState<any>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleSetOpen = useCallback((state: boolean) => {
    setIsOpen(state);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const patientData = await fetchPatient(userId);
      setPatient(patientData);

      if (patientData) {
        Sentry.metrics.set("user_view_new-appointment", patientData.name);
      }
    };

    fetchData();
  }, [userId]);

  if (!patient) {
    return (
      <div className="flex h-screen max-h-screen">
        <section className="container my-auto">
          <h1>Patient not found</h1>
        </section>
      </div>
    );
  }

  return (
    <div className="flex h-auto relative">
      <section className="remove-scrollbar mt-[6rem] mx-auto ">
        <div className="sub-container max-w-[700px] py-6 flex-1 justify-between shadow-neutral-800 forms border_unv rounded-2xl px-5">
          <AppointmentForm
            patientId={patient?.$id}
            userId={userId}
            type="create"
            setOpen={handleSetOpen}
          />
        </div>

        <div className="absolute top-8 left-5 z-[-1]">
        <Image
          src="/assets/images/3dball.jpg"
          height={1500}
          width={1500}
          alt="appointment"
          className="side-img max-w-[500px] bg-bottom object-cover image-shadow"
        />
      </div>
      </section>
    </div>
  );
};

export default Appointment;
