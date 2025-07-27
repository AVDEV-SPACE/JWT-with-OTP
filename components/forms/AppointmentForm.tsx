"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { getAppointmentSchema } from "@/lib/validation";
import "react-phone-number-input/style.css";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { Doctors } from "@/constants";
import Image from "next/image";
import { SelectItem } from "../ui/select";
import { createAppointment, getAppointmentsByDate } from "@/lib/actions/appointment.actions";
import { Appointment } from "@/types/appwrite.types";

// Dummy definitions for demonstration if not already defined:
type Status = "pending" | "scheduled" | "cancelled";

interface UpdateAppointmentParams {
    userId: string;
    appointmentId: string;
    appointment: Partial<Appointment>;
    type: "create" | "cancel" | "schedule";
}

export const AppointmentForm = ({
    userId,
    patientId,
    type = "create",
    appointment,
    setOpen,
    onFormSubmit,
    onSuccess,
}: {

    userId: string;
    patientId: string;
    type: "create" | "cancel" | "schedule";
    appointment?: Appointment;

    setOpen: (open: boolean) => void;
    onFormSubmit: (appointment: UpdateAppointmentParams) => Promise<Appointment>;
    onSuccess?: () => void;

}) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState<string>(appointment?.primaryPhysician || '');
    const [bookedTimes, setBookedTimes] = useState<Date[]>([]);

    const AppointmentFormValidation = getAppointmentSchema(type);

    //? ensures the response are well handeld
    const form = useForm<z.infer<typeof AppointmentFormValidation>>({
        resolver: zodResolver(AppointmentFormValidation),
        defaultValues: {
            primaryPhysician: appointment ? appointment.primaryPhysician : '',
            schedule: appointment?.schedule ? new Date(appointment.schedule) : new Date(),
            reason: appointment ? appointment.reason : '',
            note: appointment?.note || '',
            cancellationReason: appointment?.cancellationReason || "",
        },
    });

    //! -- calling the slots checking function  
    useEffect(() => {
        const fetchBookedAppointments = async () => {
            if (!selectedDoctor) return;

            try {
                const today = new Date();
                const appointments = await getAppointmentsByDate(today, selectedDoctor);
                const bookedDates = appointments.map(app => new Date(app.schedule));
                setBookedTimes(bookedDates);
            } catch (error) {
                console.error("Error fetching booked appointments:", error);
            }
        };

        fetchBookedAppointments();
    }, [selectedDoctor]);

    async function onSubmit(values: z.infer<typeof AppointmentFormValidation>) {
        setIsLoading(true);

        let status;
        switch (type) {
            case 'schedule':
                status = 'scheduled';
                break;
            case 'cancel':
                status = 'cancelled';
                break;
            default:
                status = 'pending';
                break;
        }

        try {
            if (type === 'create' && patientId) {
                const appointmentData = {
                    userId,
                    patient: patientId,
                    primaryPhysician: values.primaryPhysician,
                    schedule: new Date(values.schedule),
                    reason: values.reason!,
                    note: values.note,
                    status: status as Status,
                };

                const appointment = await createAppointment(appointmentData);

                if (appointment) {
                    form.reset();
                    router.push(`/patients/${userId}/new-appointment/success?appointmentId=${appointment.$id}`);
                    if (onSuccess) onSuccess();
                }
            } else {
                const appointmentToUpdate: UpdateAppointmentParams = {
                    userId,
                    appointmentId: appointment?.$id!,
                    appointment: {
                        primaryPhysician: values.primaryPhysician,
                        schedule: new Date(values.schedule),
                        status: status as Status,
                        cancellationReason: values.cancellationReason,
                    },
                    type,
                };

                const updatedAppointment = await onFormSubmit(appointmentToUpdate);

                if (updatedAppointment) {
                    setOpen(false);
                    form.reset();
                }
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 max-w-3xl  flex-1 ">
                {type === 'create' && (
                    <section className="mb-12">
                        <h1 className="header text-white">Schedule your appointment</h1>
                    </section>
                )}

                {type !== "cancel" && (
                    <>
                        <CustomFormField
                            fieldType={FormFieldType.SELECT}
                            control={form.control}
                            name="primaryPhysician"
                            label="Doctor"
                            placeholder="Select a doctor"
                            labelClassName="text-white"
                        >

                        {Doctors.map((doctor, i) => (
                            <SelectItem
                            key={doctor.name + i}
                            value={doctor.name}
                            className="bg-black/90 text-white rounded-md z-50" // Increased z-index
                            >
                            <div className="flex cursor-pointer items-center gap-2">
                                <Image
                                src={doctor.image}
                                width={32}
                                height={32}
                                alt="doctor"
                                className="rounded-full"
                                />
                                <p>{doctor.name}</p>
                            </div>
                            </SelectItem>
                        ))}

                        </CustomFormField>

                        <CustomFormField
                            control={form.control}
                            name="schedule"
                            fieldType={FormFieldType.DATE_PICKER}
                            label="Expected appointment date"
                            showTimeSelect
                            dateFormat="MM/dd/yyyy - h:mm aa"
                            selectedDoctor={selectedDoctor}
                            bookedTimes={bookedTimes}
                            onChange={(date) => form.setValue("schedule", date)}
                            labelClassName="text-white"
                        />

                        <div className={`flex flex-col gap-2 ${type === "create" && "xl:flex-row"}`}>
                            <CustomFormField
                                fieldType={FormFieldType.TEXTAREA}
                                control={form.control}
                                name="reason"
                                label="Appointment reason"
                                placeholder="Annual monthly check-up"
                                labelClassName="text-white"
                            />

                            <CustomFormField
                                fieldType={FormFieldType.TEXTAREA}
                                control={form.control}
                                name="note"
                                label="Comments/notes"
                                placeholder="Prefer afternoon appointments, if possible"
                                labelClassName="text-white"
                            />                           
                        </div>
                        
                    </>
                )}

                {type === "cancel" && (
                    <CustomFormField
                        fieldType={FormFieldType.TEXTAREA}
                        control={form.control}
                        name="cancellationReason"
                        label="Reason for cancellation"
                        placeholder="Urgent meeting came up"
                        labelClassName="text-white"
                    />
                )}

                <SubmitButton isLoading={isLoading} className="w-full py-2 h-10 shad-primary-btn">
                    <p className="text-white">{type === 'cancel' ? 'Cancel Appointment' : type === 'schedule' ? 'Schedule Appointment' : 'Submit Appointment'}</p>
                </SubmitButton>
            </form>
        </Form>
    );
};

export default AppointmentForm;