import AppointmentForm from "@/components/forms/AppointmentForm";
import Image from "next/image";
import { getPatient } from "@/lib/actions/patient.actions";
import * as Sentry from '@sentry/nextjs'


export default async function AppointmentPage( {params: {userId}}: SearchParamProps) {
  const patient = await getPatient(userId);
  Sentry.metrics.set("user_view_new_appointment", patient.name);

  return (
    <div className="flex h-screen max-h-screen">
     <section className="remove-scrollbar container">
      <div className="sub-container max-w-[860px] flex-1 justify-between">
        <Image
         src='/assets/icons/logo.png'
         alt="Logo"
         height={1000}
         width={1000}
         className="my-8 h-10 w-fit"
         
        />

        <AppointmentForm
        type="create"
        userId={userId}
        patientId={patient?.$id}
  
        
         />

    
          <p>
          &#169; E-Medical Center <span className="text-sm text-gray-300">by Nanino</span> 
          </p>
         
  

      </div>

     </section>

     <Image
     src='/assets/images/appointment.jpg'
     height={1000}
     width={1000}
     alt="appointment"
     className="side-img max-w-[50%] object-left"
      
    />
    </div>
  );
}
