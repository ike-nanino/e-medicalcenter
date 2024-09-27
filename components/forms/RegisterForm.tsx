"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl
} from "@/components/ui/form"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import { PatientFormValidation } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { registerPatient } from "@/lib/actions/patient.actions"
import React from "react"
import { FormFieldType } from "./PatientForm"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Doctors, GenderOptions, IdentificationTypes, PatientFormDefaultValues } from "@/constants"
import { Label } from "../ui/label"
import { SelectItem } from "../ui/select"
import Image from "next/image"
import FileUploader from "../FileUploader"




function RegisterForm( { user }: { user: User}) {

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);


  // 1. Define your form.
  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      ...PatientFormDefaultValues,
      name: "",
      email:"",
      phone:"",
    },
  })

  
 async function onSubmit(values: z.infer<typeof PatientFormValidation>) {
  setIsLoading(true);

  let formData;

  if(values.identificationDocument && values.identificationDocument.length > 0) {
    const blobFile = new Blob ([values.identificationDocument[0]], {
      type: values.identificationDocument[0].type,
    })

    formData = new FormData();
    formData.append('blobFile', blobFile);
    formData.append('fileName', values.identificationDocument[0].name);
  }



  try {
    const patientData = {
      userId: user.$id,
     ...values,
      birthDate: new Date(values.birthDate),
      identificationDocument: formData,
    };

    // @ts-ignore
    const patient = await registerPatient(patientData);

        if(patient) {
          router.push(`/patients/${user.$id}/new-appointment`)
        }
      } catch (error) {
        console.log(error)
      }

  }

  return (
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12 flex-1">
      <section className='space-y-4'>
        <h1 className="header">Welcome 👋🏾 </h1>
        <p className='text-dark-700'>Let us know more about yourself.</p>
      </section>


      <section className='space-y-6'>
        <div className="mb-9 space-y-1">
        <h2 className="sub-header">Personal Information </h2>

        </div>
      </section>
      

      {/* NAME */}
      <CustomFormField
        fieldType={FormFieldType.INPUT}
        control={form.control}
        name="name"
        label="Full Name"
       
      />

      <div className="flex flex-col gap-6 xl:flex-row">
           {/* EMAIL & PHONE */}
      <CustomFormField
        fieldType={FormFieldType.INPUT}
        control={form.control}
        name="email"
        label="Email"
        placeholder="e.g amadoe@gmail.com"
      />
      <CustomFormField
        fieldType={FormFieldType.PHONE_INPUT}
        control={form.control}
        name="phone"
        label="Phone Number"
        placeholder="054 345 7898"
      />

      </div>
             {/* BirthDate & Gender */}
      <div className="flex flex-col gap-6 xl:flex-row">
      <CustomFormField
        fieldType={FormFieldType.DATE_PICKER}
        control={form.control}
        name="birthDate"
        label="Date of Birth"
        placeholder="Select birth date"
        
      />
      <CustomFormField
        fieldType={FormFieldType.SKELETON}
        control={form.control}
        name="gender"
        label="Gender"
        renderSkeleton={(field) => (
          <FormControl>
            <RadioGroup className="flex h-9 gap-6 xl:justify-between"
            onValueChange={field.onChange}
            defaultValue={field.value}
            >
              {GenderOptions.map((option) => (
                  <div key={option} className="radio-group">
                    <RadioGroupItem
                      value={option}
                      id={option}
                    
                    />

                    <Label htmlFor={option} className="cursor-pointer">
                      {option}
                    </Label>
                  </div>
                
              ))}

            </RadioGroup>
          </FormControl>
        )}
      />
      </div>

       {/* Address & Occupation */}

      <div className="flex flex-col gap-6 xl:flex-row">

      <CustomFormField
        fieldType={FormFieldType.INPUT}
        control={form.control}
        name="address"
        label="Address"
      />

      <CustomFormField
        fieldType={FormFieldType.INPUT}
        control={form.control}
        name="occupation"
        label="Occupation"
        placeholder="e.g Teacher"
      />
      </div>

          {/* Emergency Contact Name & Emergency Contact Number */}

      <div className="flex flex-col gap-6 xl:flex-row">

      <CustomFormField
        fieldType={FormFieldType.INPUT}
        control={form.control}
        name="emergencyContactName"
        label="Emergency Contact Name"
        placeholder="Guardian's name"
      />

      <CustomFormField
        fieldType={FormFieldType.PHONE_INPUT}
        control={form.control}
        name="emergencyContactNumber"
        label="Emergency Contact Number"
        placeholder="054 345 7898"
      />

      </div>

        <section className='space-y-6'>
        <div className="mb-9 space-y-1">
        <h2 className="sub-header">Medical Information</h2>

        </div>
      </section>

        {/* PRIMARY CARE PHYSICIAN */}

      <CustomFormField
        fieldType={FormFieldType.SELECT}
        control={form.control}
        name="primaryPhysician"
        label="Doctor"
        placeholder="Select a Doctor"
       >
        {Doctors.map((doctor) => (
          <SelectItem key={doctor.name} value={doctor.name}>
            <div className="flex cursor-pointer items-end gap-2">
              <Image 
              src={doctor.image}
              width={32}
              height={32}
              alt={doctor.name}
              className="rounded-full border border-dark-500"
              />

              <p>{doctor.name}</p>

            </div>
            
          </SelectItem>
        ))}
       </CustomFormField>

           {/* INSURANCE & POLICY NUMBER */}
      <div className="flex flex-col gap-6 xl:flex-row">
          
      <CustomFormField
        fieldType={FormFieldType.INPUT}
        control={form.control}
        name="insuranceProvider"
        label="Insurance Provider"
         placeholder="e.g NHIS"
      />

      <CustomFormField
        fieldType={FormFieldType.INPUT}
        control={form.control}
        name="insurancePolicyNumber"
        label="Insurance Policy Number"
        placeholder="e.g ABC123456"
      />
        
      </div>

          {/* ALLERGY & CURRENT MEDICATIONS */}

      <div className="flex flex-col gap-6 xl:flex-row">
          
      <CustomFormField
        fieldType={FormFieldType.TEXTAREA}
        control={form.control}
        name="allergies"
        label="Allergies (if any)"
         placeholder="e.g Peanuts, Penicillin, Pollen"
      />

      <CustomFormField
        fieldType={FormFieldType.TEXTAREA}
        control={form.control}
        name="currentMedication"
        label="Current Medication"
        placeholder="e.g Paracetamol 500mg, Aspirin 250mg"
      />
        
      </div>

      {/* FAMILY MEDICATION & PAST MEDICATIONS */}
      <div className="flex flex-col gap-6 xl:flex-row">
          
      <CustomFormField
        fieldType={FormFieldType.TEXTAREA}
        control={form.control}
        name="familyMedicalHistory"
        label="Family Medical History"
         placeholder="e.g Mom is diabetic"
      />

      <CustomFormField
        fieldType={FormFieldType.TEXTAREA}
        control={form.control}
        name="pastMedicalHistory"
        label="Past Medical History"
        placeholder="e.g Tonsillectomy"
      />
        
      </div>

      <section className='space-y-6'>
        <div className="mb-9 space-y-1">
        <h2 className="sub-header">Identification and Verification </h2>

        </div>
      </section>

      {/* IDENTIFICATION TYPE */}

      <CustomFormField
        fieldType={FormFieldType.SELECT}
        control={form.control}
        name="identificationType"
        label="Identification Type"
        placeholder="Select Identification Type"
       >
        {IdentificationTypes.map((type) => (
          <SelectItem key={type} value={type}>
            <div className="cursor-pointer">
            {type}
              </div> 
          </SelectItem>
        ))}
       </CustomFormField>

       <CustomFormField
        fieldType={FormFieldType.INPUT}
        control={form.control}
        name="identificationNumber"
        label="Identification Number"
        placeholder="e.g ABC123456"
      />

<CustomFormField
        fieldType={FormFieldType.SKELETON}
        control={form.control}
        name="identificationDocument"
        label="Scanned copy of ID"
        renderSkeleton={(field) => (
          <FormControl>
            <FileUploader 
             files={field.value} 
             onChange={field.onChange} 
            />
          </FormControl>
        )
       }
      />


      <section className='space-y-6'>
        <div className="mb-9 space-y-1">
        <h2 className="sub-header">Consent and Privacy </h2>

        </div>
      </section>

      <CustomFormField
        fieldType={FormFieldType.CHECKBOX}
        control={form.control}
        name="treatmentConsent"
        label="I consent to treatment"
      />
      <CustomFormField
        fieldType={FormFieldType.CHECKBOX}
        control={form.control}
        name="disclosureConsent"
        label="I consent to disclosure information"
      />
      <CustomFormField
        fieldType={FormFieldType.CHECKBOX}
        control={form.control}
        name="privacyConsent"
        label="I consent to privacy policy"
      />





      <SubmitButton isLoading={isLoading}> Submit and Continue</SubmitButton>
    </form>
  </Form>
  )
}


export default RegisterForm
