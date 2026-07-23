"use client";

import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";

import {
  UserProvider,
} from "@/context/UserContext";

import {
  ProfileProvider,
} from "@/context/ProfileContext";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <UserProvider>
      <ProfileProvider>

        <div
          className="
            flex
            min-h-screen
            w-full
            overflow-hidden
            bg-gray-50
            dark:bg-zinc-950
          "
        >

          {/* Sidebar
              Desktop:
              visible fixed width

              Mobile:
              should be hidden/toggled
              from Sidebar component
          */}

          <aside
            className="
              shrink-0
            "
          >
            <Sidebar />
          </aside>



          {/* Main Application Area */}

          <div
            className="
              flex
              min-w-0
              flex-1
              flex-col
              overflow-hidden
            "
          >


            {/* Top Header */}

            <header
              className="
                sticky
                top-0
                z-30
                shrink-0
              "
            >

              <Header
                title="Dashboard"
                subtitle="Welcome back to GradLegacy"
              />

            </header>



            {/* Page Content */}

            <main
              className="
                flex-1
                overflow-y-auto
                overflow-x-hidden
                p-4
                sm:p-6
                lg:p-8
              "
            >

              <div
                className="
                  mx-auto
                  w-full
                  max-w-7xl
                "
              >

                {children}

              </div>


            </main>


          </div>


        </div>


      </ProfileProvider>
    </UserProvider>
  );
}