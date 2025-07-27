"use client";
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from './ui/button';
import AppointmentForm from './forms/AppointmentForm';
import { Appointment } from '@/types/appwrite.types';
import { getAppointmentsByDate } from '@/lib/actions/appointment.actions';

interface AppointmentModalProps {
  type: "schedule" | "cancel" | "create";
  appointment: Appointment | null;
  title: string | null;
  description: string | null;
  onAppointmentChange: (appointment: UpdateAppointmentParams) => Promise<Appointment>;
  fetchAppointments?: () => void;   
}

const AppointmentModal = ({

  type,
  appointment,
  title,
  description,
  onAppointmentChange,
  fetchAppointments,

}: AppointmentModalProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [bookedTimes, setBookedTimes] = useState<Date[]>([]);

  useEffect(() => {
    // Fetch initial booked times when modal opens
    if (internalOpen) {
      fetchBookedTimes(new Date());
    }
  }, [internalOpen]);

  const fetchBookedTimes = async (date: Date) => {
    try {
      const appointments = await getAppointmentsByDate(date, 'doctorId');
      const bookedSlots = appointments.map((app: Appointment) => new Date(app.schedule));
      setBookedTimes(bookedSlots);
    } catch (error) {
      console.error('Error fetching booked times:', error);
    }
  };

  //! TRIGGERS THE PROP PASSED IN THE `/admin` route for the `columns`, 
  //! arguments passed on DataTable  
  const handleAppointmentChange = async (appointmentData: UpdateAppointmentParams) => {

    await onAppointmentChange(appointmentData);
    if (fetchAppointments) {
      fetchAppointments();
    }

    setInternalOpen(false);
  };

  if (appointment === null) return null;

  return (
    <Dialog open={internalOpen} onOpenChange={setInternalOpen}>

      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          className={`capitalize ${type === 'schedule' ? 'text-white' : ''}`}
        >
          {type}
        </Button>
      </DialogTrigger>

      <DialogContent className="shad-dialog sm:max-w-md shadow-md" style={{ zIndex: 1000 }}>
        <DialogHeader className="mb-4">
          <DialogTitle className="capitalize">{type === 'schedule' ? 'schedule appointment' : title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <AppointmentForm
          userId={appointment.userId}
          patientId={appointment.patient}
          type={type}
          onFormSubmit={handleAppointmentChange}
          status={appointment.status}
          appointment={appointment}
          setOpen={setInternalOpen}
          bookedTimes={bookedTimes}
          onDateChange={fetchBookedTimes}
        />  
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentModal;