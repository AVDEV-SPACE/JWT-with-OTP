// lib/actions/admin.actions.ts
import { account, databases } from "@/lib/appwrite.config";
import { ID, Query } from "node-appwrite";
import { DATABASE_ID, REQUESTS_ADMIN_ID } from "../appwrite.config";

//* --  Funcție pentru crearea unei cereri de admin
export async function createAdminRequest(data: { name: string; email: string; userId: string }) {
  try {
    // Verificăm dacă DATABASE_ID este definit
    if (!process.env.DATABASE_ID || !process.env.REQUESTS_ADMIN_ID) {
      throw new Error("Database ID or Requests Admin ID is missing in environment variables");
    }

    // Creează documentul în colecția 'REQUESTS_ADMIN_ID'
    const response = await databases.createDocument(
      process.env.DATABASE_ID, 
      process.env.REQUESTS_ADMIN_ID, 
      ID.unique(), 
      data
    );
    return response;
  } catch (error) {
    console.error("Error creating admin request:", error);
    throw new Error("Failed to create admin request");
  }
}

//* --  Funcție pentru login admin
// ! TODO , W.I.P
export const loginAdmin = async (email: string, password: string) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error) {
    console.error("Error logging in admin:", error);
    throw new Error("Login failed");
  }
};

//* --  Funcție pentru setarea cheii OTP
// ! TODO , W.I.P

export const setOTP = async (userId: string, otp: string) => {
  try {
    // Creează documentul OTP în colecția corespunzătoare
    await databases.createDocument(
      process.env.DATABASE_ID!,
      process.env.OTP_COLLECTION_ID!,
      ID.unique(),
      { userId, otp }
    );
    return { message: 'OTP set successfully' };
  } catch (error) {
    console.error("Error setting OTP:", error);
    throw new Error("Failed to set OTP");
  }
};

//* -- Funcție pentru verificarea cheii OTP
export const verifyOTP = async (userId: string, otp: string) => {
  try {
    // Căutăm documentele OTP în baza de date
    const otpDocument = await databases.listDocuments(
      process.env.DATABASE_ID!,
      process.env.OTP_COLLECTION_ID!,
      [Query.equal("userId", [userId]), Query.equal("otp", [otp])]
    );

    if (otpDocument.documents.length > 0) {
      return { message: 'OTP verified' };
    } else {
      throw new Error('Invalid OTP');
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    throw new Error("OTP verification failed");
  }
};
