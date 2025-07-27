// app/admin/columns.ts - Rămâne neschimbat de la ultima versiune

"use client";
import { ColumnDef } from "@tanstack/react-table";
import StatusBadge from "@/components/StatusBadge";
import Image from "next/image";
import { formatDateTime } from "@/lib/utils";
import { Doctors } from "@/constants";
import AppointmentModal from "@/components/AppointmentModal";

import type { Appointment } from "@/types/appwrite.types";
import type { UpdateAppointmentParams } from "@/types/appwrite.types.ts";

export const columns = (
  
  handleOpenModal: (
    appointment: Appointment,
    type: "schedule" | "cancel" | "create"
  ) => void,

  onAppointmentChange: (
    appointment: UpdateAppointmentParams
  ) => Promise<Appointment | void>

): ColumnDef<Appointment>[] => [

  {
    accessorKey: "patient",
    header: "Patient",
    cell: ({ row }) => {
      const patientName = row.original.patient ? row.original.patient.name : "Unknown";
      return (
        <p className="text-14-medium text-left flex-grow min-w-0 whitespace-normal break-words">
          {patientName}
        </p>
      );
    },
  },

  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <div className="flex justify-start flex-shrink-0 min-w-[50px]"> 
          <StatusBadge status={status} />
        </div>
      );
    },
  },

  {
    accessorKey: "schedule",
    header: "Appointment",
    cell: ({ row }) => {
      const appointment = row.original;
      return (
        <p className="text-14-regular min-w-[115px] text-left">
          {formatDateTime(appointment.schedule).dateTime}
        </p>
      );
    },
  },

  {
    accessorKey: "primaryPhysician",
    header: "Doctor",
    cell: ({ row }) => {
      const appointment = row.original;
      const doctor = Doctors.find(
        (doctor) => doctor.name === appointment.primaryPhysician
      );
      return (
        <div className="flex items-center gap-3">
          <Image
            src={doctor?.image!}
            alt="doctor"
            width={100}
            height={100}
            className="size-8"
          />
          <p className="whitespace-nowrap">Dr. {doctor?.name}</p>
        </div>
      );
    },
  },

  {
    accessorKey: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => {
      const appointment = row.original;

      return (
        <div className="flex gap-1 text-white justify-center flex-wrap flex-shrink-0 min-w-[70px]"> 
          <AppointmentModal
            appointment={appointment}
            type="schedule"
            title="S" 
            description="Please confirm the following details to schedule."
            onAppointmentChange={onAppointmentChange}
            setOpen={() => handleOpenModal(appointment, "schedule")}
            onClose={() => {}}
          />

          <AppointmentModal
            appointment={appointment}
            type="cancel"
            title="C" 
            description="Are you sure you want to cancel your appointment?"
            onAppointmentChange={onAppointmentChange}
            setOpen={() => handleOpenModal(appointment, "cancel")}
            onClose={() => {}}
          />
        </div>
      );
    },
  },
  
];