// lib/appwrite.config.ts
import * as sdk from 'node-appwrite';

export const {
    PROJECT_ID, API_KEY, DATABASE_ID,
    PATIENT_COLLECTION_ID, DOCTOR_COLLECTION_ID, APPOINTMENT_COLLECTION_ID, REQUESTS_ADMIN_ID, ORGANIZATIONS_COLLECTION_ID,
    TWILLIO, TWILLIO_AUTH,
    NEXT_PUBLIC_BUCKET_ID: BUCKET_ID,
    NEXT_PUBLIC_ENDPOINT: ENDPOINT
} =  process.env;

//! ----- >> Appwrite Config for Users
const client = new sdk.Client();

client
.setEndpoint('https://cloud.appwrite.io/v1')
.setProject('66a0e28f0010bb70d57a')
.setKey('dbae7a56e519491df054c4b609c6d506b4f2595a3ee8e373b0bdbe80feca37b77c9a22d7cca43274153146b49fe24243f32a08c052a1bd7444c348f439fea37bbef93536cddee4c3620acbbb6a89f1f30bafc9cf529067f1801085e111dcfcfe5afaf8d96947567f5c359cf6f56a6098ccccf71208d331ac8ff4f6bb273f4738');

export const databases = new sdk.Databases(client);
export const storage = new sdk.Storage(client);
export const messaging = new sdk.Messaging(client);
export const users = new sdk.Users(client);
export const account = new sdk.Account(client);  



