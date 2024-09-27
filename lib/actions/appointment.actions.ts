
"use server"


import { formatDateTime } from '@/lib/utils';
import { ID, Query } from "node-appwrite"
import { APPOINTMENT_COLLECTION_ID, DATABASE_ID, databases, messaging } from "../appwrite.config"
import { parseStringify } from "../utils";
import { Appointment } from "@/types/appwrite.types";
import { revalidatePath } from "next/cache";

export const createAppointment = async (appointment: CreateAppointmentParams) => {
    try {
        const newAppointment = await databases.createDocument(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            ID.unique(),
           appointment
          );
      
          return parseStringify(newAppointment);
        } catch (error) {
          console.error("An error occurred while creating a new Appointment:", error);
        }
};


export const getAppointment = async (appointmentId: string) => {
  try {
    const appointment = await databases.getDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId,
    )

    return parseStringify(appointment);
  } catch (error) {
    console.log(error)
  }
}

export const getRecentAppointmentList = async () => {
  try {
    const appointments = await databases.listDocuments(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      [Query.orderDesc('$createdAt')]
    );

    const initialCounts = {
      scheduledCount: 0,
      pendingCount:  0,
      cancelledCount: 0,
    }

   const counts = (appointments.documents as Appointment[]).reduce(
      (acc, appointment) => {
        switch (appointment.status) {
          case "pending":
            acc.pendingCount++;
            break;
          case "scheduled":
            acc.scheduledCount++;
            break;
          case "cancelled":
            acc.cancelledCount++;
            break;
        }
        return acc;
      },
      initialCounts
    );

    const data = {
      totalCount: appointments.total,
      ...counts,
      documents: appointments.documents,
    };

    return parseStringify(data);
    
  } catch (error) {
    console.log(error)
  }
}


export const updateAppointment = async ({
  appointmentId,
  userId,
  timeZone,
  appointment,
  type
}: UpdateAppointmentParams) => {
  try {
    // Update appointment to scheduled -> https://appwrite.io/docs/references/cloud/server-nodejs/databases#updateDocument
    const updatedAppointment = await databases.updateDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId,
      appointment
    );

    if (!updatedAppointment){
      throw new Error('Appointment not found');
    }

  const smsMessage = `Greetings from E-Medical Center by Nanino. ${type === "schedule" ? `Your appointment is confirmed and scheduled for ${formatDateTime(appointment.schedule!, timeZone).dateTime} with Dr. ${appointment.primaryPhysician}` : `We regret to inform you that your appointment for ${formatDateTime(appointment.schedule!, timeZone).dateTime} is cancelled. We are sorry for any inconvenience caused. Reason:  ${appointment.cancellationReason}`}.`

  
    await sendSMSNotification(userId, smsMessage);

    revalidatePath("/admin");
    return parseStringify(updatedAppointment);
  } catch (error) {
    console.error("An error occurred while scheduling an appointment:", error);
  }
};


export const sendSMSNotification = async (userId: string, content:string) => {
  try {
    const message = await messaging.createSms(
      ID.unique(),
      content,
      [],
      [userId]
    )
  
      return parseStringify(message);

  } catch(error) {
    console.log(error);
  }
}


