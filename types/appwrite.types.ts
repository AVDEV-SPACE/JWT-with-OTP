import { Models } from "node-appwrite";

export interface Patient extends Models.Document {
  userId: string;
  name: string;
  email: string;
  phone: string;
  birthDate: Date;
  gender: Gender;
  address: string;
  occupation: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  primaryPhysician: string;
  insuranceProvider: string;
  insurancePolicyNumber: string;
  allergies: string | undefined;
  currentMedication: string | undefined;
  familyMedicalHistory: string | undefined;
  pastMedicalHistory: string | undefined;
  identificationType: string | undefined;
  identificationNumber: string | undefined;
  identificationDocument: FormData | undefined;
  privacyConsent: boolean;
}

export interface Appointment extends Models.Document {
  $id: string;
  patient: string; 
  schedule: Date; 
  status: "scheduled" | "pending" | "cancelled";
  primaryPhysician: string;
  reason: string;
  note: string;
  userId: string;
  cancellationReason: string | null;
}

interface AppointmentFormProps {
  userId: string;
  patientId: string;
  type: "schedule" | "cancel" | "create";
  appointment?: Appointment;
  setOpen: (open: boolean) => void;
  onFormSubmit: (appointment: UpdateAppointmentParams) => Promise<Appointment>;
  status?: "scheduled" | "pending" | "cancelled"; // Adaugă status ca prop opțional
}

export interface UpdateAppointmentParams {
  userId: string;
  appointmentId: string | undefined; //  undefined pentru appointmentId
  appointment: Appointment;
  type: "create" | "cancel" | "schedule";
}

export interface Organization {
  $id: string;
  name: string;
  adminId: string;
  email: string;
  description?: string;
  createdAt: string;
}