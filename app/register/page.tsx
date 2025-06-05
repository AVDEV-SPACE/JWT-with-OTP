import { PatientForm } from "@/components/forms/PatientForm";
import  PasskeyModal  from "@/components/PasskeyModal";
import Image from "next/image";
import '../landing_page.css'

export default function Register({searchParams} : SearchParamProps) {
  const isAdmin = searchParams?.admin === 'true';

  return ( 
    <div className="flex h-screen max-h-screen">
      {isAdmin && <PasskeyModal />}

      <section className="remove-scrollbar container pt-2">

      <div className="sub-container flex-1 max-w-[496px]">

       <PatientForm/>

        <div className="h-4"></div>
        
      </div>
      </section>

      <div className="relative w-full md:w-1/2">
        <Image 
          src="/assets/images/3dlink.avif"
          height={1000}
          width={1000}
          alt="patient"
          className="side-img w-full h-full object-cover"
        />
      </div>
    </div>
  );
}