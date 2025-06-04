"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Appointment } from "@/types/appwrite.types";
import StatusBadge from "../StatusBadge";
import Image from "next/image";
import { formatDateTime } from "@/lib/utils";
import { Doctors } from "@/constants";
import AppointmentModal from "../AppointmentModal";

export const columnsfilters: ColumnDef<Appointment>[] = [
  {
    header: "Nr.",
    cell: ({ row }) => <p className="text-14-medium ">{row.index + 1}</p>,
  },
  {
    accessorKey: "patient",
    header: "Patient",
    cell: ({ row }) => {
      const patient = row.original.patient;
      return <p className="text-14-medium ">{patient ? patient.name : "Unknown"}</p>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <div className="min-w-[115px]"><StatusBadge status={row.original.status} /></div>,
  },
  {
    accessorKey: "schedule",
    header: "Appointment",
    cell: ({ row }) => {
      const appointment = row.original;
      return (
        <p className="text-14-regular min-w-[100px]">
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

];
