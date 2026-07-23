"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  GraduationCap,
  User,
  AtSign,
  Building2,
  BookOpen,
  CalendarDays,
  Sparkles,
  ArrowRight,
  Home,
  ArrowLeft,
} from "lucide-react";

import { authService } from "@/services/auth";
import { profileService } from "@/services/profile";
import ImageUpload from "@/components/ImageUpload";


export default function ProfileSetupPage() {

  const router = useRouter();


  const [loading,setLoading] =
    useState(false);

  const [existingId,setExistingId] =
    useState<string|null>(null);

  const [message,setMessage] =
    useState("");

  const [isSuccess,setIsSuccess] =
    useState(false);



  const [form,setForm] = useState({

    fullName:"",
    username:"",
    bio:"",
    university:"",
    department:"",
    graduationYear:"",
    profileImage:"",
    coverImage:"",

  });





  useEffect(()=>{

    loadProfile();

  },[]);




  const loadProfile = async()=>{

    const user =
      await authService.getCurrentUser();


    if(!user) return;



    const profile =
      await profileService.getProfileByUserId(
        user.$id
      );



    if(profile){

      setExistingId(profile.$id);


      setForm({

        fullName:
          profile.fullName || "",

        username:
          profile.username || "",

        bio:
          profile.bio || "",

        university:
          profile.university || "",

        department:
          profile.department || "",

        graduationYear:
          profile.graduationYear?.toString() || "",

        profileImage:
          profile.profileImage || "",

        coverImage:
          profile.coverImage || "",

      });

    }

  };






  const handleChange =
  (
    e:React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement
    >
  )=>{

    setForm({

      ...form,

      [e.target.name]:
        e.target.value

    });


    setMessage("");

  };






  const handleSubmit =
  async(
    e:React.FormEvent<HTMLFormElement>
  )=>{

    e.preventDefault();


    try{

      setLoading(true);


      const user =
        await authService.getCurrentUser();


      if(!user) return;



      if(existingId){

        await profileService.updateProfile(
          existingId,
          {
            ...form,
            graduationYear:
              Number(form.graduationYear),
            status:"draft",
          }
        );

      }
      else{

        await profileService.createProfile({

          userId:user.$id,

          ...form,

          graduationYear:
            Number(form.graduationYear),

          status:"draft",

        });

      }




      setIsSuccess(true);

      setMessage(
        "Profile saved successfully! Redirecting..."
      );



      setTimeout(()=>{

        router.push("/dashboard");

      },1200);



    }
    catch(err:any){

      console.error(err);

      setIsSuccess(false);

      setMessage(
        err?.message ||
        "Error saving profile"
      );

    }
    finally{

      setLoading(false);

    }

  };







  return (

    <div
      className="
        min-h-screen

        bg-gradient-to-br

        from-[#0b1120]

        via-[#0f172a]

        to-[#162035]

        px-4

        py-6

        sm:px-6

        sm:py-10

        overflow-hidden
      "
    >


      {/* Glow */}

      <div
        className="
          fixed
          top-0
          right-0

          w-72
          h-72

          sm:w-[26rem]
          sm:h-[26rem]

          bg-blue-500/10

          rounded-full

          blur-[110px]

          pointer-events-none
        "
      />


      <div
        className="
          relative
          z-10

          mx-auto

          w-full

          max-w-2xl
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

            mb-6

            sm:mb-8
          "
        >


          <div
            className="
              flex
              items-center
              gap-3
            "
          >

            <div
              className="
                rounded-2xl

                bg-white/10

                p-2.5

                border

                border-white/10

                backdrop-blur
              "
            >

              <GraduationCap
                size={24}
                className="text-yellow-400"
              />

            </div>



            <span
              className="
                text-xl
                font-bold
                text-white
              "
            >

              Grad
              <span className="text-yellow-400">
                Legacy
              </span>

            </span>


          </div>




          <Link
            href="/"
            className="
              flex
              items-center
              gap-2

              text-sm

              text-white/60

              hover:text-white
            "
          >

            <Home size={15}/>

            Home

          </Link>


        </div>







        {/* CARD */}


        <div
          className="
            bg-white

            rounded-3xl

            shadow-2xl

            overflow-hidden
          "
        >



          <div
            className="
              px-5
              py-6

              sm:px-8

              border-b
              border-gray-100
            "
          >


            <div
              className="
                inline-flex

                items-center

                gap-2

                rounded-full

                bg-gray-100

                px-3

                py-1

                text-[10px]

                font-bold

                uppercase
              "
            >

              <Sparkles
                size={10}
                className="text-yellow-500"
              />

              {existingId
              ?"Edit Profile"
              :"Get Started"}

            </div>




            <h1
              className="
                mt-3

                text-2xl

                font-extrabold

                text-[#0f172a]
              "
            >

              Profile Setup

            </h1>


          </div>







          <form

            onSubmit={handleSubmit}

            className="
              space-y-5

              px-5

              py-6

              sm:px-8
            "

          >


            {
              message && (

              <div
                className={`
                  rounded-xl

                  border

                  px-4

                  py-3

                  text-xs

                  ${
                    isSuccess
                    ?
                    "bg-green-50 border-green-200 text-green-700"
                    :
                    "bg-red-50 border-red-200 text-red-700"
                  }
                `}
              >

                {message}

              </div>

              )
            }






            {/* IMAGES */}

            <div
              className="
                grid

                grid-cols-1

                sm:grid-cols-2

                gap-4
              "
            >

              <ImageUpload
                label="Profile Image"
                onUpload={(url)=>
                  setForm(p=>({
                    ...p,
                    profileImage:url
                  }))
                }
              />


              <ImageUpload
                label="Cover Image"
                onUpload={(url)=>
                  setForm(p=>({
                    ...p,
                    coverImage:url
                  }))
                }
              />

            </div>







            {/* INPUTS */}

            {[
              {
                name:"fullName",
                icon:User,
                placeholder:"John Doe"
              },

              {
                name:"username",
                icon:AtSign,
                placeholder:"username"
              },

            ].map((item)=>(

              <div key={item.name}>

                <div
                  className="
                    relative
                  "
                >

                  <item.icon

                    size={16}

                    className="
                      absolute

                      left-3

                      top-1/2

                      -translate-y-1/2

                      text-gray-400
                    "

                  />


                  <input

                    name={item.name}

                    value={
                      form[
                        item.name as keyof typeof form
                      ]
                    }

                    onChange={handleChange}

                    placeholder={item.placeholder}

                    className="
                      w-full

                      rounded-xl

                      border

                      border-gray-200

                      bg-gray-50

                      py-3

                      pl-10

                      text-sm

                      outline-none

                      focus:bg-white

                      focus:border-[#0f172a]
                    "

                  />


                </div>

              </div>


            ))}






            <textarea

              name="bio"

              value={form.bio}

              onChange={handleChange}

              rows={4}

              placeholder="Tell people about yourself..."

              className="
                w-full

                rounded-xl

                border

                border-gray-200

                bg-gray-50

                p-3

                text-sm

                resize-none
              "

            />







            <div
              className="
                grid

                grid-cols-1

                sm:grid-cols-2

                gap-4
              "
            >

              <input

                name="university"

                value={form.university}

                onChange={handleChange}

                placeholder="University"

                className="
                  rounded-xl
                  border
                  p-3
                  text-sm
                "

              />


              <input

                name="department"

                value={form.department}

                onChange={handleChange}

                placeholder="Department"

                className="
                  rounded-xl
                  border
                  p-3
                  text-sm
                "

              />

            </div>







            <input

              name="graduationYear"

              value={form.graduationYear}

              onChange={handleChange}

              placeholder="Graduation Year"

              className="
                w-full

                rounded-xl

                border

                p-3

                text-sm
              "

            />








            <button

              disabled={loading}

              className="
                w-full

                rounded-xl

                bg-gradient-to-r

                from-yellow-400

                to-yellow-500

                py-3

                font-semibold

                text-[#0f172a]

                flex

                justify-center

                items-center

                gap-2

                disabled:opacity-50
              "

            >

              {
                loading
                ?
                "Saving..."
                :
                <>
                {existingId
                ?"Update"
                :"Apply"}

                <ArrowRight size={15}/>

                </>
              }


            </button>



          </form>


        </div>


      </div>


    </div>

  );

}