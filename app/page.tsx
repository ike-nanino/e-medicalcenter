import PatientForm from "@/components/forms/PatientForm";
import PasskeyModal from "@/components/PasskeyModal";
import Image from "next/image";
import Link from "next/link";


export default function Home( {searchParams}: SearchParamProps) {
  const isAdmin = searchParams.admin === 'true';


  return (
    <div className="flex h-screen max-h-screen">
      { isAdmin && <PasskeyModal />}


     <section className="remove-scrollbar container my-auto">
      <div className="sub-container max-w-[496px]">
        <Image
         src='/assets/icons/logo.png'
         alt="Logo"
         height={1000}
         width={1000}
         className="mb-8 h-10 w-fit"
         
        />

        <PatientForm />

        <div className="text-14-regular mt-16 flex justify-between items-center">
          <p>
          &#169; E-Medical Center <span className="text-sm text-gray-300">by Nanino</span> 
          </p>
          <Link href="/?admin=true" className="text-white p-2 bg-green-500 border-0 rounded">
          <span className=" "> Admin </span>

          </Link>
        </div>

      </div>

     </section>

     <Image
     src='/assets/images/home.jpg'
     height={1000}
     width={1000}
     alt="Patient"
     className="side-img max-w-[50%]"
      
    />
    </div>
  );
}
