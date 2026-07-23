"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  Images,
  Plus,
} from "lucide-react";

import { useMediaContext } from "@/context/MediaContext";
import { CATEGORIES } from "@/lib/media/categories";
import CategoryMotif from "@/components/media/CategoryMotif";
import UploadMediaModal from "@/components/media/UploadMediaModal";


export default function MediaHubPage() {

  const {
    userId,
    media,
    loading,
    refresh,
  } = useMediaContext();


  const [uploadOpen, setUploadOpen] =
    useState(false);



  const counts = useMemo(() => {

    const map: Record<string, number> = {};


    CATEGORIES.forEach((c)=>{

      map[c.slug] =
        media.filter(c.match).length;

    });


    return map;


  }, [media]);





  return (

    <div
      className="
        space-y-6
        sm:space-y-8
        p-4
        sm:p-6
        lg:p-8
        overflow-hidden
      "
    >



      {/* HEADER */}

      <div
        className="
          flex
          flex-col
          gap-5

          lg:flex-row
          lg:items-end
          lg:justify-between
        "
      >


        <div
          className="
            min-w-0
          "
        >


          <Link
            href="/dashboard"
            className="
              inline-flex
              items-center
              gap-2
              mb-4
              text-xs
              sm:text-sm
              font-semibold
              text-gray-500
              dark:text-slate-500
              hover:text-[#FFD700]
              transition
            "
          >

            <ArrowLeft size={15}/>

            Back to Home

          </Link>





          <div
            className="
              inline-flex
              items-center
              gap-2
              rounded-full

              bg-gray-100
              dark:bg-slate-900

              border
              border-[#FFD700]/30

              px-3
              py-1.5

              text-[10px]
              font-bold
              uppercase
              tracking-widest

              text-[#B8860B]
              dark:text-[#FFD700]
            "
          >

            <Images size={12}/>

            Media Vault

          </div>





          <h1
            className="
              mt-4

              text-2xl
              sm:text-3xl
              lg:text-4xl

              font-extrabold
              tracking-tight

              text-gray-900
              dark:text-white
            "
          >

            {
              loading
              ?
              "Loading your media..."
              :
              `${media.length} ${
                media.length === 1
                ? "memory"
                : "memories"
              } saved`
            }


          </h1>





          <p
            className="
              mt-2
              max-w-xl
              text-sm
              text-gray-500
              dark:text-slate-400
            "
          >

            Pick a category to browse, search and manage your memories.

          </p>


        </div>







        {/* UPLOAD BUTTON */}


        <button
          onClick={() =>
            setUploadOpen(true)
          }

          className="
            flex
            w-full
            sm:w-auto

            justify-center
            items-center

            gap-2

            rounded-2xl

            bg-gradient-to-r
            from-gray-100
            to-gray-200

            dark:from-slate-800
            dark:to-slate-900

            border
            border-[#FFD700]/50

            px-6
            py-3

            text-sm
            font-bold

            text-[#B8860B]
            dark:text-[#FFD700]

            transition

            hover:border-[#FFD700]

            active:scale-95
          "
        >

          <Plus size={16}/>

          Upload

        </button>


      </div>







      {/* CATEGORY GRID */}


      <div
        className="
          grid

          grid-cols-1

          sm:grid-cols-2

          xl:grid-cols-4

          gap-4
          sm:gap-5
        "
      >


        {
          CATEGORIES.map((c)=>{


            const Icon =
              c.icon;



            return (

              <Link

                key={c.slug}

                href={
                  `/dashboard/media/${c.slug}`
                }

                className="
                  group

                  relative

                  overflow-hidden

                  rounded-3xl

                  border

                  border-gray-200
                  dark:border-slate-800


                  bg-gradient-to-br

                  from-white
                  to-gray-50

                  dark:from-slate-900
                  dark:to-slate-950


                  p-5

                  shadow-lg

                  transition-all

                  duration-300


                  hover:-translate-y-1

                  hover:shadow-xl

                "
              >





                {/* TOP */}

                <div
                  className="
                    flex
                    items-start
                    justify-between
                  "
                >

                  <CategoryMotif
                    slug={c.slug}
                    className="relative"
                  />



                  <ArrowUpRight

                    size={17}

                    className="
                      text-gray-400
                      dark:text-slate-600

                      transition

                      group-hover:text-[#FFD700]

                      group-hover:translate-x-1

                      group-hover:-translate-y-1
                    "

                  />


                </div>







                {/* ICON */}


                <div
                  className={`
                    mt-5

                    flex

                    h-10

                    w-10

                    items-center

                    justify-center

                    rounded-xl

                    ${c.accent.bg}

                    shadow-md
                  `}
                >

                  <Icon
                    size={17}
                    className="text-white"
                  />

                </div>







                <p
                  className="
                    mt-4

                    text-[10px]

                    font-bold

                    uppercase

                    tracking-widest

                    text-gray-400

                    dark:text-slate-500
                  "
                >

                  {c.eyebrow}

                </p>





                <h2
                  className="
                    mt-1

                    text-lg

                    font-extrabold

                    text-gray-900

                    dark:text-white
                  "
                >

                  {c.label}

                </h2>






                <p
                  className="
                    mt-2

                    text-xs

                    leading-relaxed

                    text-gray-500

                    dark:text-slate-400
                  "
                >

                  {c.description}

                </p>







                <p
                  className={`
                    mt-5

                    text-3xl

                    font-extrabold

                    tracking-tight

                    ${c.accent.text}
                  `}
                >

                  {
                    loading
                    ?
                    "–"
                    :
                    counts[c.slug] ?? 0
                  }


                </p>







                <div
                  className={`
                    absolute

                    inset-x-0

                    bottom-0

                    h-[3px]

                    bg-gradient-to-r

                    ${c.accent.from}

                    ${c.accent.to}

                    opacity-0

                    transition-opacity

                    duration-300

                    group-hover:opacity-100
                  `}
                />



              </Link>


            );


          })
        }


      </div>







      <UploadMediaModal

        open={uploadOpen}

        userId={userId}

        onClose={() =>
          setUploadOpen(false)
        }


        onUploaded={async()=>{

          setUploadOpen(false);

          await refresh();

        }}

      />



    </div>

  );
}