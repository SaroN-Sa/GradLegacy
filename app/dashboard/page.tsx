"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  GraduationCap,
  CheckCircle2,
  Clock,
  XCircle,
  Circle,
  ArrowRight,
  Eye,
  Pencil,
  Sparkles,
  UserRound,
  ArrowLeft,
} from "lucide-react";

import { authService } from "@/services/auth";
import { profileService } from "@/services/profile";
import type { Profile } from "@/types/profile";

const PROFILE_FIELDS = [
  "fullName",
  "username",
  "bio",
  "university",
  "department",
  "profileImage",
  "coverImage",
] as const;

const STATUS_CONFIG: Record<
  string,
  {
    label: string;
    icon: typeof Circle;
    badgeClass: string;
    dotClass: string;
  }
> = {
  pending: {
    label: "Pending Review",
    icon: Clock,
    badgeClass:
      "bg-amber-900/20 text-amber-300 border-amber-500/30",
    dotClass: "bg-amber-400",
  },

  approved: {
    label: "Approved",
    icon: CheckCircle2,
    badgeClass:
      "bg-emerald-900/20 text-emerald-300 border-emerald-500/30",
    dotClass: "bg-emerald-400",
  },

  rejected: {
    label: "Rejected",
    icon: XCircle,
    badgeClass:
      "bg-red-900/20 text-red-300 border-red-500/30",
    dotClass: "bg-red-400",
  },

  none: {
    label: "Not Applied",
    icon: Circle,
    badgeClass:
      "bg-slate-800/60 text-slate-400 border-slate-700",
    dotClass: "bg-slate-500",
  },

  draft: {
    label: "Draft Saved",
    icon: Pencil,
    badgeClass:
      "bg-blue-900/20 text-blue-300 border-blue-500/30",
    dotClass: "bg-blue-400",
  },
};

export default function DashboardPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    try {
      const user = await authService.getCurrentUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const result =
        await profileService.getProfileByUserId(user.$id);

      setProfile(result || null);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }


  async function handleAction() {
    try {
      if (!profile) {
        router.push("/dashboard/profile/setup");
        return;
      }

      if (profile.status === "pending") return;


      if (profile.status === "approved") {
        router.push(`/graduate/${profile.username}`);
        return;
      }


      await profileService.updateProfile(
        profile.$id,
        {
          status: "pending",
        }
      );

      router.push("/dashboard/profile/setup");

    } catch (error) {
      console.error(error);
    }
  }


  function calculateProgress(
    p: Profile | null
  ) {

    if (!p) return 0;

    const filled =
      PROFILE_FIELDS.filter(
        field => Boolean(p[field])
      ).length;

    return Math.round(
      (filled / PROFILE_FIELDS.length) * 100
    );
  }



  const rawStatus =
    profile?.status ?? "none";


  const status =
    rawStatus in STATUS_CONFIG
      ? rawStatus
      : "none";


  const statusInfo =
    STATUS_CONFIG[status];


  const StatusIcon =
    statusInfo.icon;


  const progress =
    calculateProgress(profile);



  const buttonLabel =
    status === "pending"
      ? "Pending Approval"
      : status === "approved"
      ? "View Public Page"
      : status === "rejected"
      ? "Edit & Reapply"
      : status === "draft"
      ? "Continue Application"
      : "Apply Now";


  const ButtonIcon =
    status === "approved"
      ? Eye
      : status === "rejected" ||
        status === "draft"
      ? Pencil
      : ArrowRight;



  if (loading) {

    return (
      <div className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-gradient-to-br
        from-[#0b1120]
        via-[#0f172a]
        to-[#162035]
      ">

        <div className="
          flex
          flex-col
          items-center
          gap-3
        ">

          <div className="
            h-8
            w-8
            animate-spin
            rounded-full
            border-2
            border-[#FFD700]
            border-t-transparent
          "/>

          <p className="
            text-sm
            text-white/50
          ">
            Loading dashboard...
          </p>

        </div>

      </div>
    );
  }



  return (

    <div className="
      relative
      min-h-full
      w-full
      overflow-hidden
      bg-gradient-to-br
      from-[#0b1120]
      via-[#0f172a]
      to-[#162035]
      px-4
      py-6
      sm:px-6
      lg:px-10
    ">


      {/* Background effects */}

      <div className="
        pointer-events-none
        fixed
        -right-20
        -top-20
        h-72
        w-72
        rounded-full
        bg-blue-500/10
        blur-[100px]
      "/>


      <div className="
        pointer-events-none
        fixed
        -bottom-20
        -left-20
        h-80
        w-80
        rounded-full
        bg-purple-500/10
        blur-[100px]
      "/>



      <div className="
        relative
        z-10
        mx-auto
        w-full
        max-w-6xl
        space-y-5
      ">


        {/* Top navigation */}

        <div className="
          flex
          flex-col
          gap-4
          sm:flex-row
          sm:items-center
          sm:justify-between
        ">


          <div className="
            flex
            items-center
            justify-between
          ">


            <div className="
              flex
              items-center
              gap-3
            ">

              <div className="
                rounded-2xl
                border
                border-white/10
                bg-white/10
                p-2.5
              ">

                <GraduationCap
                  size={24}
                  className="text-[#FFD700]"
                />

              </div>


              <span className="
                text-lg
                font-bold
                text-white
              ">
                Grad
                <span className="text-[#FFD700]">
                  Legacy
                </span>
              </span>


            </div>


          </div>



          <div className="
            flex
            items-center
            justify-between
            gap-3
          ">


            <Link
              href="/dashboard/profile"
              className="
                flex
                items-center
                gap-1.5
                text-xs
                font-semibold
                text-slate-400
                hover:text-[#FFD700]
              "
            >

              <ArrowLeft size={14}/>
              Profile

            </Link>


            <div className={`
              flex
              items-center
              gap-2
              rounded-full
              border
              px-3
              py-1.5
              text-xs
              font-semibold
              ${statusInfo.badgeClass}
            `}>

              <span className={`
                h-2
                w-2
                rounded-full
                ${statusInfo.dotClass}
              `}/>

              {statusInfo.label}

            </div>


          </div>


        </div>




        {/* Welcome card */}

        <div className="
          flex
          flex-col
          gap-4
          rounded-3xl
          border
          border-slate-800
          bg-gradient-to-br
          from-slate-900
          to-slate-950
          p-5
          shadow-xl
          sm:flex-row
          sm:items-center
          sm:p-7
        ">


          <div className="
            flex
            h-14
            w-14
            shrink-0
            items-center
            justify-center
            overflow-hidden
            rounded-2xl
            bg-[#FFD700]/10
          ">


            {profile?.profileImage ? (

              <img
                src={profile.profileImage}
                alt={profile.fullName}
                className="
                  h-full
                  w-full
                  object-cover
                "
              />

            ) : (

              <UserRound
                size={28}
                className="text-[#FFD700]"
              />

            )}


          </div>


          <div className="min-w-0">

            <h1 className="
              truncate
              text-xl
              font-extrabold
              text-white
            ">

              {profile
                ? `Welcome back, ${profile.fullName.split(" ")[0]}`
                : "Welcome to GradLegacy"
              }

            </h1>


            <p className="
              mt-1
              text-sm
              text-slate-400
            ">

              {profile
                ? "Manage your graduation legacy application."
                : "Create your graduation legacy page."
              }

            </p>


          </div>


        </div>



        {/* Cards */}

        <div className="
          grid
          grid-cols-1
          gap-5
          md:grid-cols-2
        ">


          <div className="
            rounded-3xl
            border
            border-slate-800
            bg-slate-950/70
            p-5
          ">

            <p className="
              text-xs
              uppercase
              text-slate-500
            ">
              Application Status
            </p>


            <div className="
              mt-3
              flex
              items-center
              gap-3
            ">

              <StatusIcon
                className="text-[#FFD700]"
              />


              <span className="
                font-bold
                text-white
              ">
                {statusInfo.label}
              </span>

            </div>

          </div>



          <div className="
            rounded-3xl
            border
            border-slate-800
            bg-slate-950/70
            p-5
          ">

            <p className="
              text-xs
              uppercase
              text-slate-500
            ">
              Profile Completion
            </p>


            <div className="
              mt-4
              flex
              items-center
              gap-3
            ">


              <div className="
                h-2
                flex-1
                overflow-hidden
                rounded-full
                bg-slate-800
              ">

                <div
                  className="
                    h-full
                    bg-[#FFD700]
                    transition-all
                  "
                  style={{
                    width:`${progress}%`
                  }}
                />


              </div>


              <span className="
                text-sm
                font-bold
                text-white
              ">
                {progress}%
              </span>


            </div>


          </div>


        </div>



        {/* Main Action */}

        <div className="
          rounded-3xl
          border
          border-slate-800
          bg-gradient-to-br
          from-slate-900
          to-slate-950
          p-5
          sm:p-7
        ">


          <div>

            <div className="
              inline-flex
              items-center
              gap-2
              rounded-full
              bg-[#FFD700]/10
              px-3
              py-1
              text-xs
              font-bold
              text-[#FFD700]
            ">

              <Sparkles size={12}/>
              Graduation Page

            </div>


            <h2 className="
              mt-3
              text-lg
              font-bold
              text-white
            ">
              Graduation Page Application
            </h2>


            <p className="
              mt-2
              max-w-xl
              text-sm
              text-slate-400
            ">
              Manage your public graduation page application.
            </p>


          </div>



          <button
            onClick={handleAction}
            disabled={status==="pending"}
            className="
              mt-6
              flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-2xl
              border
              border-[#FFD700]/40
              bg-slate-900
              px-5
              py-3
              text-sm
              font-bold
              text-[#FFD700]
              transition
              hover:border-[#FFD700]
              sm:w-auto
            "
          >

            {buttonLabel}

            <ButtonIcon size={16}/>

          </button>


        </div>


      </div>


    </div>

  );
}