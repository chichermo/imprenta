import { Client, Databases } from "appwrite";

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;

export function isAppwriteConfigured() {
  return Boolean(endpoint && projectId && databaseId);
}

export function getAppwriteClient() {
  if (!isAppwriteConfigured()) {
    return null;
  }

  return new Client().setEndpoint(endpoint!).setProject(projectId!);
}

export function getAppwriteDatabases() {
  const client = getAppwriteClient();

  if (!client) {
    return null;
  }

  return new Databases(client);
}

export function getAppwriteDatabaseId() {
  return databaseId ?? "";
}
