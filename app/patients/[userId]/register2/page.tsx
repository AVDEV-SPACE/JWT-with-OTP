import Image from "next/image";
import RegisterForm from "@/components/forms/RegisterForm";
import { getUser } from "@/lib/actions/patient.actions";
import * as Sentry from '@sentry/nextjs'

const Register = async ({ params: { userId } }: SearchParamProps) => {
  const user = await getUser(userId);

  // Sentry.metrics.set("user_view_register", user.name);

  return (
    <div className="flex h-screen max-h-screen">
      <section className="container">
        <div className="sub-container max-w-[860px] flex-1 flex-col py-10">

          <RegisterForm user={user} />

          <p className="copyright py-4">Scaleup©</p>
        </div>
        <div className="relative z-[-1]">
          <Image
            src="/assets/images/3dlink.avif"
            height={700}
            width={700}
            alt="patient"
            className="side-img max-w-[350px] object-cover image-shadow"
          />
        </div>
      </section>
    </div>
  );
};

export default Register;