"use client";

import { account } from "@/lib/appwrite";

export default function TestPage() {
  const testConnection = async () => {
    try {
      const user = await account.get();
      console.log(user);
    } catch (error) {
      console.log("Not logged in yet");
    }
  };

  return (
    <div className="p-10">
      <button
        onClick={testConnection}
        className="border px-4 py-2 rounded"
      >
        Test Appwrite
      </button>
    </div>
  );
}