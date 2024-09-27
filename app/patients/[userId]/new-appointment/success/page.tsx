import { Doctors } from '@/constants';
import { getAppointment } from '@/lib/actions/appointment.actions';
import { formatDateTime } from '@/lib/utils';
import Image from 'next/image'
import Link from 'next/link'
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCalendar
} from '@fortawesome/free-solid-svg-icons';
import { Button } from '@/components/ui/button';
import * as Sentry from '@sentry/nextjs'
import { getUser } from '@/lib/actions/patient.actions';




async function Success( { params: {userId}, searchParams}: SearchParamProps) {

    const appointmentId = (searchParams?.appointmentId as string) || '';

    const appointment = await getAppointment(appointmentId);

    const doctor = Doctors.find((doc) => doc.name === appointment.primaryPhysician)

    const user = await getUser(userId);
    
    Sentry.metrics.set("user_view_success", user.name);


  return (
    <div className='flex h-screen max-h-screen px-[5%]'>
        <div className='success-img'>

            
            <Link href='/'>
                <Image
                src="/assets/icons/logo.png"
                height={1000}
                width={1000}
                alt="logo"
                className="h-10 w-fit"
                />
            </Link>

            <section className='flex flex-col items-center'>

              <div>
                <h2> Success </h2>
              </div>

            <h2 className="header mb-6 max-w-[600px] text-center">
                Your <span className='text-green-500'>appointment request </span>has been submitted successfully 
            </h2>

            <p>We will be in touch shortly to confirm</p>
            </section>

            <section className="request-details">
                <p>Requested appointment details:</p>

                <div className="flex items-center gap-3">
                    <Image 
                    src={doctor?.image}
                    alt="doctor"
                    width={100}
                    height={100}
                    className="size-6"
                    />

                    <p className="whitespace-nowrap"> Dr. {doctor?.name}</p>

                </div>

                <div className="flex gap-2">
                  <FontAwesomeIcon icon={faCalendar} />
                    <p>{formatDateTime(appointment.schedule).dateTime}</p>
                </div>
            </section>

            <div className="flex gap-8">
                <Button variant="outline" className="shad-primary-btn" asChild>
                    <Link href={`/patients/${userId}/new-appointment`}>
                        New Appointment
                    </Link>
                </Button>
            </div>
            
            
          <p className='mt-6'>
          &#169; E-Medical Center <span className="text-sm text-gray-300">by Nanino</span> 
          </p>
        </div>

    </div>  
)
}

export default Success
