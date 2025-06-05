import { Button } from '@/components/ui/button';
import { Doctors } from '@/constants';
import { getAppointment } from '@/lib/actions/appointment.actions';
import { formatDateTime } from '@/lib/utils';
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import * as Sentry from '@sentry/nextjs'
import { getUser } from '@/lib/actions/patient.actions';
import { FaLocationArrow } from "react-icons/fa6";



const Success = async ({ params: {userId}, searchParams }: SearchParamProps) => {
  const appointmentId = (searchParams?.appointmentId as string) || '';
  const appointment = await getAppointment(appointmentId)
  const doctor = Doctors.find((doc) => doc.name === appointment.primaryPhysician )
  const user = await getUser(userId);

  Sentry.metrics.set("user_view_appointment-success", user.name);

  return (
    <div className='flex h-auto px-[5%] py-8'>
      <div className='success-img max-w-[900px] max-h-screen shadow-neutral-800 forms border_unv rounded-2xl px-2 py-3'>
      <Link href='/'>
        <Image 
         src="/assets/icons/logo-full.svg"
         height={1000}
         width={1000}
         alt="logo"
         className="h-10 w-fit"
        />
      </Link>

      <section className='flex flex-col items-center '>
        <Image 
          src="/assets/gifs/success.gif"
          height={300}
          width={280}
          alt='success'
        />
      <h2 className='header mb-6 max-w-[600px] text-center'>
          Your <span className='text-succes gradient__text'>appointment request</span> has been succesfully submited
      </h2>
      <p>We will be in touch shortly to confirm.</p>
      </section>

      <section className='request-details'>
        <p>Requested appointment details:</p>
        <div className='flex items-center gap-3'>
          <Image
            src={doctor?.image!}
            height={100}
            width={100}
            alt='doctor'
            className='size-6'
          />
          <p className='whitespace-nowrap'>Dr. {doctor?.name}</p>
        </div>
        <div className='flex gap-2'> 
          <Image 
            src="/assets/icons/calendar.svg"
            height={24}
            width={24}
            alt="calendar"
          />
          <p>{formatDateTime(appointment.schedule).dateTime}</p>
        </div>
      </section>
      <div className="btn -mt-10">
      <Link href={`/patients/${userId}/new-appointment`}>
        <div  className='shad-primary-btn w-[170px] h-[30px] border' >
            <p>New Appointment</p>
        </div>
        </Link>

        <p className="copyright py-2 mx-auto">
          Scaleup©
        </p>
      </div>

      </div>
    </div>
  )
}

export default Success