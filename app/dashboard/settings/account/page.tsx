"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  Settings,
} from "lucide-react";


import { useAccount } from "@/hooks/useAccount";


import EmailCard from "@/components/settings/account/EmailCard";
import PasswordCard from "@/components/settings/account/PasswordCard";
import SessionsCard from "@/components/settings/account/SessionsCard";


import ChangeEmailModal from "@/components/settings/account/ChangeEmailModal";
import ChangePasswordModal from "@/components/settings/account/ChangePasswordModal";
import LogoutAllModal from "@/components/settings/account/LogoutAllModal";



export default function AccountSettingsPage() {

  const router = useRouter();



  const {
    account,
    sessions,
    loading,

    changeEmail,
    changePassword,

    logoutAllSessions,

  } = useAccount();





  const [emailOpen,setEmailOpen] =
    useState(false);

  const [passwordOpen,setPasswordOpen] =
    useState(false);

  const [logoutOpen,setLogoutOpen] =
    useState(false);

  const [loggingOut,setLoggingOut] =
    useState(false);

  const [logoutError,setLogoutError] =
    useState<string|null>(null);







  async function handleConfirmLogoutAll(){

    if(loggingOut)
      return;



    setLoggingOut(true);

    setLogoutError(null);



    try{

      await logoutAllSessions();


    }
    catch(err){

      const isUnauthorized =
        typeof err === "object" &&
        err !== null &&
        "code" in err &&
        (err as {code?:number}).code === 401;



      if(!isUnauthorized){

        console.error(
          "Failed logout:",
          err
        );


        setLogoutError(
          "Something went wrong while logging out. Please try again."
        );


        setLoggingOut(false);

        return;

      }

    }



    setLoggingOut(false);

    setLogoutOpen(false);


    router.replace("/login");

  }








  return (

    <main
      className="
        min-h-screen

        overflow-x-hidden

        px-4

        py-6

        sm:px-6

        lg:px-8
      "
    >


      <div
        className="
          mx-auto

          max-w-5xl

          space-y-6

          sm:space-y-8
        "
      >





        {/* HEADER */}


        <header>


          <button

            onClick={() =>
              router.push(
                "/dashboard/settings"
              )
            }


            className="
              mb-5

              flex

              items-center

              gap-2

              rounded-lg

              text-sm

              font-medium

              text-blue-600

              hover:text-blue-700

              transition

            "
          >

            <ArrowLeft
              size={17}
            />

            Back to Settings

          </button>







          <div
            className="
              flex

              flex-col

              gap-4

              sm:flex-row

              sm:items-center
            "
          >



            <div
              className="
                flex

                h-12

                w-12

                items-center

                justify-center

                rounded-2xl

                bg-blue-100

                dark:bg-blue-900/30
              "
            >

              <Settings
                className="
                  h-7
                  w-7
                  text-blue-600
                "
              />

            </div>





            <div>

              <h1
                className="
                  text-2xl

                  sm:text-3xl

                  font-bold

                  text-gray-900

                  dark:text-white
                "
              >

                Account Settings

              </h1>



              <p
                className="
                  mt-1

                  text-sm

                  text-gray-500

                  dark:text-gray-400
                "
              >

                Manage your account security and authentication.

              </p>


            </div>


          </div>



        </header>









        {/* CONTENT */}



        {
          loading && (

            <div
              className="
                rounded-2xl

                border

                border-gray-200

                dark:border-zinc-800

                bg-white

                dark:bg-zinc-900

                p-6

                text-center

                text-sm

                text-gray-500
              "
            >

              Loading account...

            </div>


          )
        }






        {
          !loading && (

            <section
              className="
                space-y-5

                sm:space-y-6
              "
            >



              <EmailCard

                account={account}

                onChangeEmail={() =>
                  setEmailOpen(true)
                }

              />





              <PasswordCard

                onChangePassword={() =>
                  setPasswordOpen(true)
                }

              />





              <SessionsCard

                sessions={sessions}

                onLogoutAll={() =>
                  setLogoutOpen(true)
                }

              />



            </section>


          )
        }






      </div>









      {/* MODALS */}



      <ChangeEmailModal

        open={emailOpen}

        currentEmail={
          account?.email ?? ""
        }

        onClose={() =>
          setEmailOpen(false)
        }

        onSubmit={changeEmail}

      />







      <ChangePasswordModal

        open={passwordOpen}

        onClose={() =>
          setPasswordOpen(false)
        }

        onSubmit={changePassword}

      />








      <LogoutAllModal

        open={logoutOpen}

        onClose={() => {

          if(!loggingOut)
            setLogoutOpen(false);

        }}

        onConfirm={
          handleConfirmLogoutAll
        }

        loading={
          loggingOut
        }

        error={
          logoutError
        }

      />





    </main>

  );

}