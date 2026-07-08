import { Client, Account, Databases, Storage, ID, Query } from "appwrite";

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const project = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;

if (!endpoint || !project || !databaseId) {
  const missing = [
    !endpoint && "NEXT_PUBLIC_APPWRITE_ENDPOINT",
    !project && "NEXT_PUBLIC_APPWRITE_PROJECT_ID",
    !databaseId && "NEXT_PUBLIC_APPWRITE_DATABASE_ID",
  ]
    .filter(Boolean)
    .join(", ");

  throw new Error(
    `Missing Appwrite environment variable(s): ${missing}. ` +
      `Add them to .env.local and restart the dev server (env changes are not hot-reloaded).`
  );
}

const client = new Client().setEndpoint(endpoint).setProject(project);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export const DATABASE_ID = databaseId;

export { ID, Query };