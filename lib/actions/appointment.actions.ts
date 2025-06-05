"use server";

import { Databases, ID, Query } from "node-appwrite";
import {
    DATABASE_ID,
    databases,
    APPOINTMENT_COLLECTION_ID,
    PATIENT_COLLECTION_ID,
    messaging,
} from "../appwrite.config";
import { formatDateTime } from "../utils"; // Eliminăm parseStringify
import { Appointment } from "@/types/appwrite.types";
import { revalidatePath } from "next/cache";

export const createAppointment = async (
    appointment: CreateAppointmentParams
) => {
    try {
        const newAppointment = await databases.createDocument(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            ID.unique(),
            appointment
        );
        return newAppointment; 
    } catch (error) {
        console.log(error);
    }
};

//* ---- >>> GET APPOINTMENT
export const getAppointment = async (appointmentId: string) => {
    try {
        const appointment = await databases.getDocument(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            appointmentId
        );
        return appointment; 
    } catch (error) {
        console.error(
            "An error occurred while retrieving the existing patient:",
            error
        );
    }
};

//!  GET RECENT APPOINTMENTS
export const getRecentAppointmentList = async (page: number = 0, pageSize: number = 100) => {
    try {
        console.log(`Fetching appointments - Page: ${page}, PageSize: ${pageSize}`); // 🔍 Debugging

        const offset = page * pageSize;

        const appointments = await databases.listDocuments(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            [
                Query.orderDesc("$createdAt"),
                Query.limit(pageSize),
                Query.offset(offset),
            ]
        );

        if (!appointments || !appointments.documents) {
            console.error("API response is empty:", appointments);
            return null;
        }

        const initialCounts = {
            scheduledCount: 0,
            pendingCount: 0,
            cancelledCount: 0,
        };

        const counts = (appointments.documents as Appointment[]).reduce(
            (acc, appointment) => {
                switch (appointment.status) {
                    case "scheduled":
                        acc.scheduledCount++;
                        break;
                    case "pending":
                        acc.pendingCount++;
                        break;
                    case "cancelled":
                        acc.cancelledCount++;
                        break;
                }
                return acc;
            },
            initialCounts
        );

        const data = {
            totalCount: appointments.total,
            ...counts,
            documents: appointments.documents,
        };

        return data;
    } catch (error) {
        console.error("Error fetching recent appointments:", error);
        return null;
    }
};

//* Asumăm cursul de schimb USD/RON (actualizează-l dacă este necesar)
const USD_TO_RON_RATE = 4.6; // POSIBIL CURS ACTUAL
//* Prețul per SMS în RON
const SMS_PRICE_RON = 0.16; // 0.032 RON per segment * 5 segmente.
//* Creditul disponibil în USD
const AVAILABLE_CREDIT_USD = 9.14;

//* Funcție pentru a obține creditul disponibil (dacă este posibil prin API)
const getAvailableCreditRON = async () => {
    // Înlocuiește cu logica reală de obținere a creditului din Twilio API, dacă este posibil
    return AVAILABLE_CREDIT_USD * USD_TO_RON_RATE;
};

//* ---- >>> UPDATE APPOINTMENT
export const updateAppointment = async ({
    appointmentId,
    userId,
    appointment,
    type,
}: UpdateAppointmentParams) => {
    try {
        // Prepare data for update
        const updatedData = {
            primaryPhysician: appointment.primaryPhysician,
            schedule: new Date(appointment.schedule),
            status: appointment.status,
            reason: appointment.reason,
            cancellationReason: appointment.cancellationReason || '',
            note: appointment.note || '',
        };

        // Perform the update
        const updatedAppointment = await databases.updateDocument(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            appointmentId,
            updatedData
        );

        if (!updatedAppointment) {
            throw new Error("Appointment not found");
        }

        // Send SMS Notification (with credit check)
        const smsMessage = `
            Hi, it's Scaleup.
            ${
                type === "schedule"
                    ? `Your appointment has been scheduled for ${formatDateTime(appointment.schedule!).dateTime} with Dr. ${appointment.primaryPhysician}.`
                    : `We regret to inform you that your appointment has been cancelled for the following reason: ${appointment.cancellationReason}`
            }
        `;

        const availableCreditRON = await getAvailableCreditRON();
        const maxSMSCount = Math.floor(availableCreditRON / SMS_PRICE_RON);

        // Verificăm dacă mai avem credit pentru a trimite SMS-ul
        if (maxSMSCount > 0) {
            await sendSMSNotification(userId, smsMessage);
            // Deduct cost from credit. (If you track credits)
        } else {
            console.warn("Insufficient credit to send SMS notification.");
        }

        // Return updated appointment data
        return updatedAppointment;

    } catch (error) {
        console.error("Error updating appointment:", error);
        throw error;
    }
};

//* ---- >>> SMS NOTIFICATION
export const sendSMSNotification = async (userId: string, content: string) => {
    try {
        const message = await messaging.createSms(
            ID.unique(),
            content,
            [],
            [userId]
        );
        return message;
    } catch (error) {
        console.log(error);
    }
};


//* ---- >>> BOKED APPOINTMENTS
export const getAppointmentsByDate = async (date: Date, doctorId: string) => {
    try {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        // console.log("🔍 Fetching appointments for:", startOfDay.toISOString(), "Doctor:", doctorId);

        const response = await databases.listDocuments(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            [
                Query.greaterThanEqual('schedule', startOfDay.toISOString()),
                Query.lessThanEqual('schedule', endOfDay.toISOString()),
                Query.equal('primaryPhysician', doctorId),
                Query.equal('status', 'scheduled')
            ]
        );

        // console.log("📌 Appointments found:", response.documents);

        //! Extragem orele rezervate în format HH:mm
        const bookedTimes = response.documents.map((apt) => {
            const aptDate = new Date(apt.schedule);
            return aptDate.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, minute: "2-digit" });
        });

        // console.log("⏰ Booked times:", bookedTimes);
        return bookedTimes;
    } catch (error) {
        console.error("❌ Error fetching appointments:", error);
        return [];
    }
};