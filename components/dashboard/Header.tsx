"use client";

import { ArrowLeft, Bell } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { account } from "@/lib/appwrite";

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
}

export default function Header({
  title,
  subtitle,
  showBack = false,
  onBack,
}: HeaderProps) {

  const { loading, user } = useCurrentUser();

  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);


  const firstName = user?.name?.split(" ")[0];


  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U";


  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? "Good Morning"
      : hour < 18
      ? "Good Afternoon"
      : "Good Evening";


  async function handleLogout() {

    try {

      await account.deleteSession("current");

    } catch (error) {

      console.error(error);

    } finally {

      router.replace("/login");

    }
  }


  return (

    <header
      className="
        sticky
        top-0
        z-40
        h-20
        border-b
        border-slate-800
        bg-slate-950/90
        backdrop-blur-xl
        px-4
        sm:px-6
        lg:px-8
        flex
        items-center
        justify-between
      "
    >


      {/* LEFT */}

      <div className="flex items-center gap-3 min-w-0">


        {showBack && (

          <button
            onClick={onBack ?? (() => router.back())}
            className="
              h-10
              w-10
              rounded-xl
              bg-slate-900
              border
              border-slate-800
              text-slate-400
              hover:text-[#FFD700]
              transition
            "
          >

            <ArrowLeft size={18}/>

          </button>

        )}



        <div>

          <h1
            className="
              text-lg
              sm:text-xl
              font-extrabold
              text-white
              tracking-tight
            "
          >

            {title}

          </h1>


          {subtitle && (

            <p className="text-xs sm:text-sm text-slate-400">

              {subtitle}

            </p>

          )}

        </div>


      </div>



      {/* RIGHT */}

      <div className="flex items-center gap-3">


        {/* Notification */}

        <button
          className="
            relative
            h-10
            w-10
            rounded-xl
            bg-slate-900
            border
            border-slate-800
            text-slate-400
            hover:text-[#FFD700]
            transition
          "
        >

          <Bell size={18} className="mx-auto"/>


          <span
            className="
              absolute
              top-2
              right-2
              h-2
              w-2
              rounded-full
              bg-red-500
            "
          />

        </button>



        {/* User menu */}

        <div className="relative">


          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="
              h-10
              w-10
              rounded-xl
              overflow-hidden
              bg-gradient-to-br
              from-slate-800
              to-slate-900
              border
              border-[#FFD700]/30
              text-[#FFD700]
              font-bold
              flex
              items-center
              justify-center
            "
          >


            {loading ? (

              <div className="h-full w-full bg-slate-700 animate-pulse"/>

            ) : user?.image ? (

              <Image
                src={user.image}
                alt={user.name}
                width={40}
                height={40}
                className="object-cover"
              />

            ) : (

              initials

            )}


          </button>



          {menuOpen && (

            <div
              className="
                absolute
                right-0
                mt-3
                w-52
                rounded-2xl
                border
                border-slate-800
                bg-slate-900
                shadow-2xl
                overflow-hidden
                z-50
              "
            >


              <div
                className="
                  px-4
                  py-3
                  border-b
                  border-slate-800
                "
              >

                <p className="text-sm font-semibold text-white truncate">

                  {user?.name || "Account"}

                </p>


                <p className="text-xs text-slate-400">

                  {firstName
                    ? `${greeting}, ${firstName}`
                    : "Welcome"}

                </p>

              </div>



              <MenuLink href="/dashboard/profile">
                My Profile
              </MenuLink>


              <MenuLink href="/dashboard">
                Dashboard
              </MenuLink>


              <MenuLink href="/dashboard/settings">
                Settings
              </MenuLink>



              <button
                onClick={handleLogout}
                className="
                  w-full
                  text-left
                  px-4
                  py-3
                  text-sm
                  text-red-400
                  hover:bg-red-500/10
                "
              >

                Logout

              </button>


            </div>

          )}

        </div>


      </div>


    </header>

  );
}



function MenuLink({
  href,
  children,
}:{
  href:string;
  children:React.ReactNode;
}) {

  return (

    <a
      href={href}
      className="
        block
        px-4
        py-3
        text-sm
        text-slate-300
        hover:bg-slate-800
        transition
      "
    >

      {children}

    </a>

  );

}