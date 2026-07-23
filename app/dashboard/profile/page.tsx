"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { account } from "@/lib/appwrite";
import { profileService } from "@/services/profile";

import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileCompletion from "@/components/profile/ProfileCompletion";
import QuickActions from "@/components/profile/QuickActions";
import ProfileStats from "@/components/profile/ProfileStats";
import QRCodeModal from "@/components/profile/QRCodeModal";
import ProfilePreviewModal from "@/components/profile/ProfilePreviewModal";
import SocialLinksCard from "@/components/profile/SocialLinksCard";

import type { GraduateProfile } from "@/types/profile";



function calcCompletion(
  profile: GraduateProfile
): number {

  const fields = [

    profile.fullName,
    profile.username,
    profile.bio,
    profile.university,
    profile.department,
    profile.graduationYear,
    profile.profileImage,
    profile.coverImage,

  ];

  return Math.round(
    (
      fields.filter(Boolean).length /
      fields.length
    ) * 100
  );

}




function getPublicUrl(
  username:string
):string {

  if(typeof window === "undefined")
    return "";

  return (
    `${window.location.origin}/graduate/${username}`
  );

}





function LoadingState(){

  return (

    <div
      className="
        min-h-screen
        flex
        items-center
        justify-center
        px-4
      "
    >

      <div
        className="
          flex
          flex-col
          items-center
          gap-4
        "
      >

        <svg
          className="
            animate-spin
            h-8
            w-8
            text-[#0f172a]
          "
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >

          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />

          <path
            className="opacity-75"
            fill="currentColor"
            d="
            M4 12a8 8 0 018-8V0C5.373
            0 0 5.373 0 12h4zm2 5.291A7.962
            7.962 0 014 12H0c0 3.042
            1.135 5.824 3 7.938l3-2.647z
            "
          />

        </svg>


        <p
          className="
            text-sm
            text-gray-400
          "
        >
          Loading your profile...
        </p>


      </div>


    </div>

  );

}





function NotFoundState({
  onSetup
}:{
  onSetup:()=>void
}){


  return (

    <div
      className="
        min-h-screen

        flex
        flex-col
        items-center
        justify-center

        text-center

        px-5
      "
    >


      <div
        className="
          w-16
          h-16
          rounded-2xl
          bg-[#0f172a]/10
          flex
          items-center
          justify-center
          mb-5
        "
      >

        <span
          className="text-3xl"
        >
          🎓
        </span>


      </div>




      <h2
        className="
          text-lg
          font-bold
          text-gray-900
        "
      >
        No profile yet
      </h2>



      <p
        className="
          mt-2
          text-sm
          text-gray-400
          max-w-sm
        "
      >
        Set up your graduation legacy page to get started.
      </p>



      <button

        onClick={onSetup}

        className="
          mt-6

          rounded-xl

          bg-gradient-to-r

          from-[#0f172a]

          to-[#1e3a5f]

          px-6

          py-3

          text-sm

          font-bold

          text-white

          hover:shadow-lg

          transition
        "
      >

        Set Up Profile

      </button>


    </div>

  );

}







export default function ProfilePage(){

  const router = useRouter();


  const [
    profile,
    setProfile
  ] =
  useState<GraduateProfile|null>(null);



  const [
    loading,
    setLoading
  ] =
  useState(true);



  const [
    showQR,
    setShowQR
  ] =
  useState(false);



  const [
    showPreview,
    setShowPreview
  ] =
  useState(false);



  const [
    shareMsg,
    setShareMsg
  ] =
  useState("");





  useEffect(()=>{

    loadProfile();

  },[]);







  async function loadProfile(){

    try{

      const user =
        await account.get();


      const data =
        await profileService.getProfileByUserId(
          user.$id
        );


      if(data)
        setProfile(
          data as GraduateProfile
        );


    }
    catch(err){

      console.error(err);

    }
    finally{

      setLoading(false);

    }

  }








  async function handleProfileImageChange(
    url:string
  ){

    if(!profile?.$id)
      return;


    await profileService.updateProfile(
      profile.$id,
      {
        profileImage:url
      }
    );


    setProfile({
      ...profile,
      profileImage:url
    });

  }







  async function handleCoverImageChange(
    url:string
  ){

    if(!profile?.$id)
      return;


    await profileService.updateProfile(
      profile.$id,
      {
        coverImage:url
      }
    );


    setProfile({
      ...profile,
      coverImage:url
    });

  }








  async function handleShare(){

    if(!profile)
      return;


    try{

      await navigator.clipboard.writeText(
        getPublicUrl(profile.username)
      );


      setShareMsg("Copied!");

    }
    catch{

      setShareMsg(
        "Failed to copy"
      );

    }


    setTimeout(
      ()=>setShareMsg(""),
      2000
    );

  }







  if(loading)
    return <LoadingState/>;





  if(!profile){

    return (

      <NotFoundState

        onSetup={()=>
          router.push(
            "/dashboard/profile/setup"
          )
        }

      />

    );

  }





  const completion =
    calcCompletion(profile);


  const publicUrl =
    getPublicUrl(profile.username);





  return (

    <div
      className="
        min-h-screen

        overflow-x-hidden

        px-4

        py-5

        sm:px-6

        lg:px-8
      "
    >



      {
        shareMsg && (

          <div
            className="
              fixed

              top-4

              right-4

              sm:top-6

              sm:right-6

              z-50

              rounded-2xl

              bg-[#0f172a]

              px-5

              py-3

              text-sm

              font-semibold

              text-white

              shadow-2xl
            "
          >

            ✓ {shareMsg}

          </div>

        )
      }







      <div
        className="
          mx-auto

          max-w-7xl

          space-y-6

          sm:space-y-8
        "
      >




        {/* BACK */}

        <button

          onClick={()=>
            router.back()
          }

          className="
            inline-flex

            items-center

            gap-2

            text-sm

            font-semibold

            text-gray-500

            hover:text-gray-900

            transition
          "
        >

          <ArrowLeft size={16}/>

          Back

        </button>








        <ProfileHeader

          profile={profile}

          onEdit={()=>
            router.push(
              "/dashboard/profile/setup"
            )
          }

          onProfileImageChange={
            handleProfileImageChange
          }

          onCoverImageChange={
            handleCoverImageChange
          }

        />







        <ProfileCompletion
          profile={profile}
        />








        <QuickActions

          onEdit={()=>
            router.push(
              "/dashboard/profile/setup"
            )
          }


          onPreview={()=>
            setShowPreview(true)
          }


          onPublicPage={()=>
            window.open(
              publicUrl,
              "_blank"
            )
          }


          onShare={handleShare}


          onQr={()=>
            setShowQR(true)
          }

        />








        <ProfileStats
          completion={completion}
        />








        <SocialLinksCard
          profile={profile}
        />


      </div>







      <QRCodeModal

        open={showQR}

        onClose={()=>
          setShowQR(false)
        }

        url={publicUrl}

      />






      <ProfilePreviewModal

        open={showPreview}

        onClose={()=>
          setShowPreview(false)
        }

        profile={profile}

      />



    </div>

  );

}