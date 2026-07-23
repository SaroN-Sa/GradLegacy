"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Trash2, Check, Clock, X } from "lucide-react";

import { authService } from "@/services/auth";
import { profileService } from "@/services/profile";

const ADMIN_EMAIL = "anjulosaron@gmail.com";

export default function AdminPage() {
  const router = useRouter();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);


  useEffect(() => {
    checkAccess();
  }, []);


  // ADMIN AUTH CHECK
  const checkAccess = async () => {
    try {
      const user = await authService.getCurrentUser();

      if (!user || user.email !== ADMIN_EMAIL) {
        router.push("/login");
        return;
      }

      setAuthorized(true);
      fetchUsers();

    } catch (err) {
      console.error("AUTH CHECK ERROR:", err);
      router.push("/login");

    } finally {
      setCheckingAuth(false);
    }
  };


  // FETCH USERS
  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await profileService.getAllProfiles();

      setProfiles(res);

    } catch (err) {
      console.error("FETCH ERROR:", err);

    } finally {
      setLoading(false);
    }
  };


  // UPDATE STATUS
  const updateStatus = async (
    id: string,
    status: string
  ) => {
    try {

      await profileService.updateProfile(id, {
        status,
      });

      await fetchUsers();

    } catch (err) {
      console.error("UPDATE ERROR:", err);
    }
  };


  // DELETE PROFILE
  const deleteProfile = async (
    id: string,
    fullName: string
  ) => {

    const confirmed = window.confirm(
      `Delete ${fullName || "this profile"}? This cannot be undone.`
    );

    if (!confirmed) return;


    try {

      setDeletingId(id);

      await profileService.deleteProfile(id);

      await fetchUsers();

    } catch (err) {

      console.error("DELETE ERROR:", err);

    } finally {

      setDeletingId(null);

    }
  };



  if (checkingAuth) {
    return (
      <div className="
        min-h-screen
        flex
        items-center
        justify-center
        text-sm
        sm:text-base
      ">
        Checking access...
      </div>
    );
  }


  if (!authorized) {
    return null;
  }


  if (loading) {
    return (
      <div className="
        min-h-screen
        flex
        items-center
        justify-center
        text-sm
        sm:text-base
      ">
        Loading users...
      </div>
    );
  }



  return (

    <main
      className="
        min-h-screen
        bg-gray-50
        dark:bg-zinc-950
        px-4
        py-5
        sm:px-6
        lg:px-10
      "
    >

      <div
        className="
          max-w-6xl
          mx-auto
        "
      >


        {/* HEADER */}

        <div
          className="
            flex
            flex-col
            gap-4
            sm:flex-row
            sm:items-center
            sm:justify-between
            mb-8
          "
        >

          <div>

            <button
              onClick={() => router.back()}
              className="
                flex
                items-center
                gap-2
                text-sm
                text-gray-600
                dark:text-gray-300
                hover:text-black
                dark:hover:text-white
                transition
                mb-4
              "
            >
              <ArrowLeft size={18}/>
              Back
            </button>


            <h1
              className="
                text-2xl
                sm:text-3xl
                lg:text-4xl
                font-bold
                tracking-tight
              "
            >
              Admin Panel
            </h1>


            <p
              className="
                text-sm
                sm:text-base
                text-gray-500
                mt-1
              "
            >
              Manage graduation profiles and approvals
            </p>

          </div>


        </div>



        {/* USERS */}

        <div
          className="
            grid
            gap-5
            sm:grid-cols-2
            lg:grid-cols-3
          "
        >


          {profiles.length === 0 && (

            <div
              className="
                col-span-full
                text-center
                py-10
                text-gray-500
              "
            >
              No users found
            </div>

          )}



          {profiles.map((p)=>(


            <div
              key={p.$id}
              className="
                bg-white
                dark:bg-zinc-900
                rounded-2xl
                shadow-sm
                border
                border-gray-100
                dark:border-zinc-800
                p-5
                flex
                flex-col
                justify-between
                transition
                hover:shadow-lg
              "
            >


              {/* PROFILE INFO */}

              <div>


                <h2
                  className="
                    text-lg
                    font-semibold
                    truncate
                  "
                >
                  {p.fullName}
                </h2>


                <p
                  className="
                    text-sm
                    text-gray-500
                    mt-1
                  "
                >
                  @{p.username}
                </p>



                <div
                  className="
                    mt-4
                    inline-flex
                    items-center
                    gap-2
                    px-3
                    py-1
                    rounded-full
                    bg-gray-100
                    dark:bg-zinc-800
                    text-sm
                  "
                >

                  Status:

                  <span
                    className="
                      font-semibold
                    "
                  >
                    {p.status || "draft"}
                  </span>

                </div>


              </div>




              {/* ACTION BUTTONS */}

              <div
                className="
                  mt-6
                  grid
                  grid-cols-2
                  gap-3
                "
              >


                <button
                  onClick={() =>
                    updateStatus(
                      p.$id,
                      "approved"
                    )
                  }
                  className="
                    flex
                    items-center
                    justify-center
                    gap-2
                    bg-green-600
                    hover:bg-green-700
                    text-white
                    py-2
                    rounded-xl
                    text-sm
                    transition
                  "
                >
                  <Check size={16}/>
                  Approve
                </button>



                <button
                  onClick={() =>
                    updateStatus(
                      p.$id,
                      "pending"
                    )
                  }
                  className="
                    flex
                    items-center
                    justify-center
                    gap-2
                    bg-yellow-500
                    hover:bg-yellow-600
                    text-white
                    py-2
                    rounded-xl
                    text-sm
                    transition
                  "
                >
                  <Clock size={16}/>
                  Pending
                </button>




                <button
                  onClick={() =>
                    updateStatus(
                      p.$id,
                      "rejected"
                    )
                  }
                  className="
                    flex
                    items-center
                    justify-center
                    gap-2
                    bg-red-600
                    hover:bg-red-700
                    text-white
                    py-2
                    rounded-xl
                    text-sm
                    transition
                  "
                >
                  <X size={16}/>
                  Reject
                </button>




                <button
                  onClick={() =>
                    deleteProfile(
                      p.$id,
                      p.fullName
                    )
                  }
                  disabled={
                    deletingId === p.$id
                  }
                  className="
                    flex
                    items-center
                    justify-center
                    gap-2
                    bg-zinc-700
                    hover:bg-zinc-800
                    text-white
                    py-2
                    rounded-xl
                    text-sm
                    transition
                    disabled:opacity-50
                  "
                >

                  <Trash2 size={16}/>

                  {
                    deletingId === p.$id
                    ? "Deleting..."
                    : "Delete"
                  }

                </button>



              </div>


            </div>


          ))}


        </div>


      </div>


    </main>

  );
}