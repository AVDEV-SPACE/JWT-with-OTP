"use client";
import { ColumnDef } from "@tanstack/react-table";
import StatusBadge from "../StatusBadge";
import Image from "next/image";
import { formatDateTime } from "@/lib/utils";
import { Doctors } from "@/constants";
import AppointmentModal from "../AppointmentModal"; 
import type { Appointment } from "@/types/appwrite.types";
import type { UpdateAppointmentParams } from "@/types/params.types";

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
      const patient = row.original.patient;
      return (
        <p className="text-14-medium text-left">{patient ? patient.name : "Unknown"}</p>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <div className="min-w-[115px]">
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
    header: () => <div className="pl-4">Actions</div>,
    cell: ({ row }) => {
      const appointment = row.original;

      return (
        <div className="flex gap-1 text-white">
          <AppointmentModal
            appointment={appointment}
            type="schedule"
            title="Schedule Appointment"
            description="Please confirm the following details to schedule."
            onAppointmentChange={onAppointmentChange}
            setOpen={() => handleOpenModal(appointment, "schedule")}
            onClose={() => {}}
          />

          <AppointmentModal
            appointment={appointment}
            type="cancel"
            title="Cancel Appointment"
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