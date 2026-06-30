import { Client, Databases, ID, Query } from "appwrite";

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

export const databases = new Databases(client);

export const DATABASE_ID = "6a3d0b9100231432c178";
export const COLLECTION_ID = "graduateprofiles";

export { ID, Query };