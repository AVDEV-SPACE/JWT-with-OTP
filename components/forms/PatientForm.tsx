"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form } from "@/components/ui/form";
import { createUser } from "@/lib/actions/patient.actions";
import { UserFormValidation } from "@/lib/validation";

import "react-phone-number-input/style.css";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { FaLocationArrow } from "react-icons/fa6";
import Link from "next/link";
import Image from "next/image";


export const PatientForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  async function onSubmit({ name, email, phone }: z.infer<typeof UserFormValidation>)  {
    setIsLoading(true);

    try {
      const userData = { name, email, phone};

      const newUser = await createUser(userData);

      if (newUser) router.push(`/patients/${newUser.$id}/register2`);
        
      
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  };


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 relative flex-1 shadow-md shadow-neutral-800 forms border_unv rounded-2xl px-5 py-3">
        <section className="mb-12">
          <Link href='/'>
            <Image 
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="logo"
            className="h-9 w-fit mb-4"
            />
          </Link>
            <h1 className="header">Hello</h1>
            <p className="text-dark-700 -mt-5">please register</p>
        </section>
        <div className="flex flex-col space-y-3">
        <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="name"
            label="Full name"
            placeholder="Name"
            iconSrc="/assets/icons/user.svg"
            iconAlt="user"
        />
        <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="email"
            label="Email"
            placeholder="your email@gamil.com"
            iconSrc="/assets/icons/email.svg"
            iconAlt="email"
        />
        <CustomFormField
            fieldType={FormFieldType.PHONE_INPUT}
            control={form.control}
            name="phone"
            label="Phone number"
            placeholder="(+40) 752 843 555"
        />

        <SubmitButton isLoading={isLoading} className="shad-primary-btn w-full mt-8">
        <p className="">Submit</p>
        <p className="">Submit</p>
        </SubmitButton>
        </div>


        <div className="text-14-regular flex items-center justify-center absolute bottom-4 text-center">
        <p className="text-center text-dark-600"> 
        © Scale-up 
        </p>
       </div>

      </form>
    </Form> 
    );
};

export default PatientForm