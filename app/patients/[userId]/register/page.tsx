import RegisterForm from "@/components/forms/RegisterForm";
import { getUser, registerPatient } from "@/lib/actions/patient.actions";
import Image from "next/image";
import { redirect } from "next/navigation";
import React from "react";
import * as Sentry from '@sentry/nextjs'


async function RegisterPage( { params: { userId } }: SearchParamProps) {
    const user = await getUser(userId);
    Sentry.metrics.set("user_view_register", user.name);
    const patient = await registerPatient(userId);


    if (patient) {
      redirect(`/patients/${userId}/new-appointment`);
    }

  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container">
        <div className="sub-container max-w-[860px] flex-1 flex-col py-10">
          <Image
            src="/assets/icons/logo.png"
            alt="Logo"
            height={1000}
            width={1000}
            className="my-8 h-10 w-fit"
          />

          <RegisterForm user={user} />

          <div className="text-14-regular mt-16 flex justify-between">
            <p> &#169; E-Medical Center <span className="text-sm text-gray-300">by Nanino</span> </p>
          </div>
        </div>
      </section>

      <Image
        src="/assets/images/register-full.jpg"
        height={1000}
        width={1000}
        alt="Patient"
        className="side-img max-w-[50%]"
      />
    </div>
  );
}

export default RegisterPage;
