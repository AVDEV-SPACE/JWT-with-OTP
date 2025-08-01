"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SelectItem } from "@/components/ui/select";
import { createUser, registerPatient } from "@/lib/actions/patient.actions";
import { PatientFormValidation } from "@/lib/validation";
import { Doctors, GenderOptions, IdentificationTypes, PatientFormDefaultValues } from "@/constants";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import SubmitButton from "@/components/SubmitButton";
import FileUploader from "@/components/ui/FileUploader";
import { FaLocationArrow } from "react-icons/fa6";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { PasskeyModal } from "@/components/PasskeyModal";
import '../landing_page.css'

const RegisterForm = ({ searchParams }: { searchParams: { admin?: string } }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const isAdmin = searchParams?.admin === 'true';

  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      ...PatientFormDefaultValues,
      name: "",
      email: "",
      phone: "",
    },
  });

  async function onSubmit(values: z.infer<typeof PatientFormValidation>) {
    setIsLoading(true);

    try {
      // Creare utilizator
      const userData = {
        name: values.name,
        email: values.email,
        phone: values.phone,
      };
      const newUser = await createUser(userData);

      if (!newUser) {
        console.error('Crearea utilizatorului a eșuat.');
        setIsLoading(false);
        return;
      }

      // Pregătire formData pentru documentul de identificare
      let formData;
      if (values.identificationDocument && values.identificationDocument.length > 0) {
        const blobFile = new Blob([values.identificationDocument[0]], {
          type: values.identificationDocument[0].type,
        });
        formData = new FormData();
        formData.append('blobFile', blobFile);
        formData.append('fileName', values.identificationDocument[0].name);
      }

      // Înregistrare pacient
      const patientData = {
        ...values,
        userId: newUser.$id,
        birthDate: new Date(values.birthDate),
        identificationDocument: formData,
      };
      const patient = await registerPatient(patientData);

      if (patient) {
        router.push(`/patients/${newUser.$id}/new-appointment`);
      } else {
        console.error('Înregistrarea pacientului a eșuat.');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="h-screen max-h-screen">
      {isAdmin && <PasskeyModal />}
      <section className="remove-scrollbar container pt-2">
        <div className="sub-container flex-1 flex-col items-center py-10">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 forms shadow-md shadow-neutral-800 forms border_unv rounded-xl px-5 py-3">
              <section className="mb-12">
                <Link href="/">
                  <Image
                    src="/assets/icons/logo-full.svg"
                    height={1000}
                    width={1000}
                    alt="logo"
                    className="h-10 w-fit mb-4"
                  />
                </Link>
                <h1 className="header">Your information is registered</h1>
                <p className="text-dark-700 -mt-8">now fill in your details bellow</p>
              </section>

              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="name"
                label="Nume complet"
                placeholder="Nume"
                iconSrc="/assets/icons/user.svg"
                iconAlt="user"
                labelClassName="text-white"
              />
              <div className="flex flex-col gap-6 xl:flex-row">
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="email"
                  label="Email"
                  placeholder="email@domeniu.com"
                  iconSrc="/assets/icons/email.svg"
                  iconAlt="email"
                  labelClassName="text-white"
                />
                <CustomFormField
                  fieldType={FormFieldType.PHONE_INPUT}
                  control={form.control}
                  name="phone"
                  label="Număr de telefon"
                  placeholder="(+40) 752 843 555"
                  labelClassName="text-white"
                />
              </div>

              <div className="flex flex-col gap-6 xl:flex-row">
                <CustomFormField
                  fieldType={FormFieldType.SKELETON}
                  control={form.control}
                  name="gender"
                  label="Gen"
                  className="w-full"
                  labelClassName="text-white"
                  renderSkeleton={(field) => (
                    <FormControl>
                      <RadioGroup
                        className="flex h-11 gap-2 xl:justify-start"
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        {GenderOptions.map((option) => (
                          <div key={option} className="radio-group">
                            <RadioGroupItem value={option} id={option} />
                            <label htmlFor={option} className="cursor-pointer text-white">
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
                  label="Adresă"
                  placeholder="Strada, Oraș"
                  labelClassName="text-white"
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="occupation"
                  label="Ocupație"
                  placeholder="Profesia dumneavoastră"
                  labelClassName="text-white"
                />
              </div>

              <div className="flex flex-col gap-6 xl:flex-row">
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="emergencyContactName"
                  label="Nume contact de urgență"
                  placeholder="Nume persoană"
                  labelClassName="text-white"
                />
                <CustomFormField
                  fieldType={FormFieldType.PHONE_INPUT}
                  control={form.control}
                  name="emergencyContactNumber"
                  label="Număr contact de urgență"
                  placeholder="(+40) 752 843 555"
                  labelClassName="text-white"
                />
              </div>

              <section className="space-y-6">
                <div className="mb-9 space-y-1">
                  <h2 className="sub-header">Informații medicale</h2>
                </div>
              </section>

              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="primaryPhysician"
                label="Medic primar"
                placeholder="Selectați un medic"
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
                  label="Furnizor de asigurare"
                  placeholder="Furnizor de asigurare"
                  labelClassName="text-white"
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="insurancePolicyNumber"
                  label="Număr poliță de asigurare"
                  placeholder="IPN000000"
                  labelClassName="text-white"
                />
              </div>

              <div className="flex flex-col gap-6 xl:flex-row">
                <CustomFormField
                  fieldType={FormFieldType.TEXTAREA}
                  control={form.control}
                  name="allergies"
                  label="Alergii (dacă există)"
                  placeholder="Praf, pisică, lapte"
                  labelClassName="text-white"
                />
                <CustomFormField
                  fieldType={FormFieldType.TEXTAREA}
                  control={form.control}
                  name="currentMedication"
                  label="Medicație curentă (dacă există)"
                  placeholder="No spa 100mg, Paracetamol 500mg"
                  labelClassName="text-white"
                />
              </div>

              <div className="flex flex-col gap-6 xl:flex-row">
                <CustomFormField
                  fieldType={FormFieldType.TEXTAREA}
                  control={form.control}
                  name="familyMedicalHistory"
                  label="Istoric medical al familiei"
                  placeholder=""
                  labelClassName="text-white"
                />
                <CustomFormField
                  fieldType={FormFieldType.TEXTAREA}
                  control={form.control}
                  name="pastMedicalHistory"
                  label="Istoric medical personal"
                  placeholder=""
                  labelClassName="text-white"
                />
              </div>

              <section className="space-y-6">
                <div className="mb-9 space-y-1">
                  <h2 className="sub-header">Identificare și verificare</h2>
                </div>
              </section>

              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="identificationType"
                label="Tip de identificare"
                placeholder="Selectați un tip de identificare"
                labelClassName="text-white"
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
                label="Număr de identificare"
                placeholder="1950724356060"
                labelClassName="text-white"
              />

              <div className="form-field">
                <Label htmlFor="identificationDocument" className="shad-form-label text-white">
                  Copie scanată a documentului de identificare
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
                  <h2 className="sub-header">Consimțământ și confidențialitate</h2>
                </div>
              </section>

              <CustomFormField
                fieldType={FormFieldType.CHECKBOX}
                control={form.control}
                name="treatmentConsent"
                label="Sunt de acord cu tratamentul"
                labelClassName="text-white"
              />
              <CustomFormField
                fieldType={FormFieldType.CHECKBOX}
                control={form.control}
                name="disclosureConsent"
                label="Sunt de acord cu divulgarea informațiilor"
                labelClassName="text-white"
              />
              <CustomFormField
                fieldType={FormFieldType.CHECKBOX}
                control={form.control}
                name="privacyConsent"
                label="Sunt de acord cu politica de confidențialitate"
                labelClassName="text-white"
              />

              <SubmitButton isLoading={isLoading} className="shad-primary-btn w-full">
                <p><FaLocationArrow size={15} /> Submit</p>
              </SubmitButton>

              <div className="text-14-regular flex items-center justify-center mt-4">
                <p className="text-center text-dark-600">© Scale-up</p>
              </div>
            </form>
          </Form>
        </div>
      </section>
      <div className="relative w-full md:w-1/2 z-[-1]">
        <Image
          src="/assets/images/3dlink.avif"
          height={1000}
          width={1000}
          alt="pacient"
          className="side-img w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default RegisterForm;  