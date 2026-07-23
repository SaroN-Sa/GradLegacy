"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ChevronRight,
  Shield,
  Settings,
  ArrowLeft,
} from "lucide-react";



export default function SettingsPage() {

  const router = useRouter();



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

          max-w-4xl

          space-y-8
        "
      >






        {/* BACK BUTTON */}

        <button

          onClick={() =>
            router.push("/dashboard")
          }


          className="
            inline-flex

            items-center

            gap-2

            text-sm

            font-semibold

            text-gray-500

            hover:text-blue-600

            transition
          "
        >

          <ArrowLeft
            size={16}
          />

          Back to Dashboard

        </button>









        {/* HEADER */}


        <header>

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

                h-14

                w-14

                items-center

                justify-center

                rounded-2xl

                bg-blue-100

                dark:bg-blue-900/30
              "
            >

              <Settings
                className="
                  h-8

                  w-8

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

                Settings

              </h1>



              <p
                className="
                  mt-1

                  text-sm

                  text-gray-500

                  dark:text-gray-400
                "
              >

                Manage your GradLegacy account settings.

              </p>


            </div>



          </div>


        </header>









        {/* SETTINGS ITEMS */}



        <section
          className="
            space-y-5
          "
        >



          <Link
            href="/dashboard/settings/account"

            className="
              block

              group
            "
          >



            <div

              className="
                rounded-2xl

                border

                border-gray-200

                bg-white

                p-5

                sm:p-6

                shadow-sm

                transition-all

                duration-200

                hover:border-blue-500

                hover:shadow-lg

                dark:border-gray-800

                dark:bg-gray-900

                dark:hover:border-blue-500
              "

            >



              <div
                className="
                  flex

                  items-center

                  justify-between

                  gap-4
                "
              >






                <div
                  className="
                    flex

                    items-center

                    gap-4

                    min-w-0
                  "
                >





                  <div

                    className="
                      flex

                      shrink-0

                      items-center

                      justify-center

                      rounded-full

                      bg-blue-100

                      p-3

                      dark:bg-blue-900/50
                    "

                  >

                    <Shield
                      className="
                        h-6

                        w-6

                        text-blue-600
                      "
                    />

                  </div>







                  <div
                    className="
                      min-w-0
                    "
                  >

                    <h2
                      className="
                        text-base

                        sm:text-lg

                        font-semibold

                        text-gray-900

                        dark:text-white
                      "
                    >

                      Account

                    </h2>





                    <p
                      className="
                        mt-1

                        text-sm

                        text-gray-500

                        dark:text-gray-400

                        leading-relaxed
                      "
                    >

                      Email, password, sessions and account security.

                    </p>


                  </div>



                </div>







                <ChevronRight

                  className="
                    h-5

                    w-5

                    shrink-0

                    text-gray-400

                    transition-transform

                    group-hover:translate-x-1

                    dark:text-gray-500
                  "

                />



              </div>


            </div>



          </Link>




        </section>




      </div>


    </main>


  );

}