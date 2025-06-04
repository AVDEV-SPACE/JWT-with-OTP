"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form, FormControl } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SelectItem } from "@/components/ui/select";
import {
  Doctors,
  GenderOptions,
  IdentificationTypes,
  PatientFormDefaultValues,
} from "@/constants";
import { registerPatient } from "@/lib/actions/patient.actions";
import { PatientFormValidation } from "@/lib/validation";
import "react-datepicker/dist/react-datepicker.css";
import "react-phone-number-input/style.css";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import FileUploader from "../ui/FileUploader";
import { FaLocationArrow } from "react-icons/fa6";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface User {
  $id: string;
}

const RegisterForm = ({ user }: { user: User }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      ...PatientFormDefaultValues,
      name: "",
      email: "",
      phone: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof PatientFormValidation>) {
    setIsLoading(true);

    let formData;

    if (values.identificationDocument && values.identificationDocument.length > 0) {
      const blobFile = new Blob([values.identificationDocument[0]], {
        type: values.identificationDocument[0].type,
      });

      formData = new FormData();
      formData.append('blobFile', blobFile);
      formData.append('fileName', values.identificationDocument[0].name);
    }

    try {
      const patientData = {
        ...values,
        userId: user.$id,
        birthDate: new Date(values.birthDate),
        identificationDocument: values.identificationDocument ? formData : undefined,
      };

      // @ts-ignore
      const patient = await registerPatient(patientData);
      // @ts-ignore
      if (patient) {
        router.push(`/patients/${user.$id}/new-appointment`);
      } else {
        console.error('Patient registration failed.');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 h-auto flex-1 shadow-neutral-800 forms border_unv rounded-2xl px-5 py-3">
        <section className="h-auto">
          <Link href="/" className="cursor-pointer">
            <Image
              src="/assets/icons/logo-full.svg"
              height={1000}
              width={1000}
              alt="patient"
              className="mb-4 h-10 w-fit"
            />
          </Link>
          <h1 className="header">Your information is registered</h1>
          <p className="text-dark-700">now fill in your details bellow</p>
        </section>

        <section className="space-y-6">
        </section>

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="name"
          label="Full name"
          placeholder="Name"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user"
          labelClassName="text-white"
        />

        <div className="flex flex-col gap-6 xl:row">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="email"
            label="Email"
            placeholder="your email@gmail.com"
            iconSrc="/assets/icons/email.svg"
            iconAlt="email"
            labelClassName="text-white" 
          />
          <CustomFormField
            fieldType={FormFieldType.PHONE_INPUT}
            control={form.control}
            name="phone"
            label="Phone number"
            placeholder="(+40) 752 843 555"
            iconSrc="/assets/icons/email.svg"
            iconAlt="email"
            labelClassName="text-white" 
          />
        </div>

        <div className="flex flex-col gap-6">
          <CustomFormField
            fieldType={FormFieldType.DATE_PICKER}
            control={form.control}
            name="birthDate"
            label="Date of birth"
            className="w-8/12 flex-2"
            labelClassName="text-white" // Adăugat
          />
          <CustomFormField
            fieldType={FormFieldType.SKELETON}
            control={form.control}
            name="gender"
            label="Gender"
            className="w-4/12"
            labelClassName="text-white" // Adăugat
            renderSkeleton={(field) => (
              <FormControl>
                <RadioGroup className="flex h-11 gap-2 xl:justify-between"
                  onValueChange={field.onChange} defaultValue={field.value}>
                  {GenderOptions.map((option) => (
                    <div key={option} className="radio-group">
                      <RadioGroupItem value={option} id={option} />
                      <label htmlFor={option} className={cn("cursor-pointer", "text-white")}>
                        {option}
                      </label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
            )}
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="address"
            label="Address"
            placeholder="nr Street, City"
            labelClassName="text-white" // Adăugat
          />
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="occupation"
            label="Occupation"
            placeholder="your profession"
            labelClassName="text-white" // Adăugat
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="emergencyContactName"
            label="Emergency contact name"
            placeholder="Person's name"
            labelClassName="text-white" // Adăugat
          />
          <CustomFormField
            fieldType={FormFieldType.PHONE_INPUT}
            control={form.control}
            name="emergencyContactNumber"
            label="Emergency contact number"
            placeholder="(+40) 752 843 555"
            labelClassName="text-white" // Adăugat
          />
        </div>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Medical information</h2>
          </div>
        </section>

        <CustomFormField
          fieldType={FormFieldType.SELECT}
          control={form.control}
          name="primaryPhysician"
          label="Primary Physician"
          placeholder="Select a physician"
          labelClassName="text-white" 
        >
          {Doctors.map((doctor) => (
            <SelectItem key={doctor.name} value={doctor.name}>
              <div className="cursor-pointer flex items-center gap-2">
                <Image
                  src={doctor.image}
                  height={32}
                  width={32}
                  alt={doctor.name}
                  className="rounded-full border border-dark-500"
                />
                <p>{doctor.name}</p>
              </div>
            </SelectItem>
          ))}
        </CustomFormField>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="insuranceProvider"
            label="Insurance provider"
            placeholder="Insurance provider"
            labelClassName="text-white" // Adăugat
          />
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="insurancePolicyNumber"
            label="Insurance policy number"
            placeholder="IPN000000"
            labelClassName="text-white" // Adăugat
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="allergies"
            label="Allergies (if any)"
            placeholder="Dust, cat, milk"
            labelClassName="text-white" // Adăugat
          />
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="currentMedication"
            label="Current medication (if any)"
            placeholder="No spa 100mg, Paracetamol 500mg"
            labelClassName="text-white" // Adăugat
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="familyMedicalHistory"
            label="Family medical history"
            placeholder=""
            labelClassName="text-white" // Adăugat
          />
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="pastMedicalHistory"
            label="Past medical history"
            placeholder=" "
            labelClassName="text-white" // Adăugat
          />
        </div>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Identification and Verification</h2>
          </div>
        </section>

        <CustomFormField
          fieldType={FormFieldType.SELECT}
          control={form.control}
          name="identificationType"
          label="Identification type"
          placeholder="Select an identification type"
          labelClassName="text-white" // Adăugat
        >
          {IdentificationTypes.map((type) => (
            <SelectItem key={type} value={type} className="text-white">
              {type}
            </SelectItem>
          ))}
        </CustomFormField>

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="identificationNumber"
          label="Identification number"
          placeholder="1950724356060"
          labelClassName="text-white" // Adăugat
        />

        {/* Randare directă a FileUploader-ului pentru a asigura vizibilitatea */}
        <div className="form-field">
            <Label htmlFor="identificationDocument" className="shad-form-label text-white">
                Scanned copy of identification document
            </Label>
            <FormControl>
                <FileUploader
                    files={form.watch("identificationDocument")}
                    onChange={(files) => form.setValue("identificationDocument", files)}
                />
            </FormControl>
        </div>


        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Consent and Privacy</h2>
          </div>
        </section>

        <CustomFormField
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name="treatmentConsent"
          label="I consent to treatment"
          labelClassName="text-white" // Adăugat
        />
        <CustomFormField
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name="disclosureConsent"
          label="I consent to disclosure of information"
          labelClassName="text-white" // Adăugat
        />
        <CustomFormField
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name="privacyConsent"
          label="I consent to privacy policy"
          labelClassName="text-white" // Adăugat
        />

        <SubmitButton isLoading={isLoading} className="shad-primary-btn w-full">
          <p><FaLocationArrow size={15} />Submit</p>
          {/* A doua <p> tag-ul pare a fi o duplicare, l-am lăsat doar pe primul */}
        </SubmitButton>
      </form>
    </Form>
  );
};

export default RegisterForm;