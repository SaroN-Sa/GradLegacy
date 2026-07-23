"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import TimelineForm from "@/components/timeline/TimelineForm";
import TimelineList from "@/components/timeline/TimelineList";

import { timelineService } from "@/services/timeline";
import { authService } from "@/services/auth";

import {
  TimelineEvent,
  CreateTimelineEventData,
  UpdateTimelineEventData,
} from "@/types/timeline";





function DeleteConfirmDialog({
  open,
  isDeleting,
  onConfirm,
  onCancel,
}: {
  open:boolean;
  isDeleting:boolean;
  onConfirm:()=>void;
  onCancel:()=>void;
}) {


  if(!open)
    return null;



  return (

    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        px-4
      "
    >


      <div
        className="
          absolute
          inset-0
          bg-black/70
          backdrop-blur-sm
        "
        onClick={onCancel}
      />




      <div
        className="
          relative

          w-full

          max-w-sm

          rounded-3xl

          border

          border-slate-800

          bg-gradient-to-br

          from-slate-900

          to-slate-950

          p-5

          sm:p-6

          shadow-2xl
        "
      >


        <div
          className="
            mb-4

            flex

            h-12

            w-12

            items-center

            justify-center

            rounded-full

            bg-red-900/20

            text-red-400
          "
        >

          <AlertTriangle size={22}/>

        </div>





        <h3
          className="
            text-lg
            font-semibold
            text-white
          "
        >

          Delete this timeline event?

        </h3>




        <p
          className="
            mt-2

            text-sm

            leading-relaxed

            text-slate-400
          "
        >

          This action cannot be undone. The event will be permanently removed from your timeline.

        </p>





        <div
          className="
            mt-6

            grid

            grid-cols-2

            gap-3
          "
        >



          <button

            onClick={onCancel}

            disabled={isDeleting}

            className="
              rounded-3xl

              border

              border-slate-700

              py-2.5

              text-sm

              font-medium

              text-slate-300

              transition

              hover:border-slate-600

              disabled:opacity-50
            "
          >

            Cancel

          </button>






          <button

            onClick={onConfirm}

            disabled={isDeleting}

            className="
              rounded-3xl

              border

              border-red-500/40

              bg-red-900/30

              py-2.5

              text-sm

              font-medium

              text-red-300

              transition

              hover:bg-red-900/50

              disabled:opacity-50
            "
          >

            {
              isDeleting
              ?
              "Deleting..."
              :
              "Delete"
            }


          </button>


        </div>



      </div>



    </div>

  );

}








export default function TimelinePage(){

  const router = useRouter();



  const [events,setEvents] =
    useState<TimelineEvent[]>([]);


  const [loading,setLoading] =
    useState(true);


  const [saving,setSaving] =
    useState(false);


  const [showForm,setShowForm] =
    useState(false);


  const [editingEvent,setEditingEvent] =
    useState<TimelineEvent|null>(null);


  const [userId,setUserId] =
    useState("");



  const [eventPendingDelete,setEventPendingDelete] =
    useState<string|null>(null);


  const [isDeleting,setIsDeleting] =
    useState(false);







  useEffect(()=>{

    initialize();

  },[]);








  async function initialize(){

    try{

      setLoading(true);


      const user =
        await authService.getCurrentUser();


      if(!user)
        return;


      setUserId(user.$id);



      const timelineEvents =
        await timelineService.getEvents(
          user.$id
        );


      setEvents(timelineEvents);


    }
    catch(error){

      console.error(error);

      toast.error(
        "Failed to load your timeline."
      );

    }
    finally{

      setLoading(false);

    }

  }








  async function refreshTimeline(){

    if(!userId)
      return;


    const timelineEvents =
      await timelineService.getEvents(userId);


    setEvents(timelineEvents);

  }








  async function handleCreate(
    data:CreateTimelineEventData
  ){


    if(!userId)
      return null;


    try{


      setSaving(true);


      const created =
        await timelineService.createEvent(
          userId,
          data
        );


      await refreshTimeline();


      setShowForm(false);


      toast.success(
        "Timeline event added."
      );


      return created;


    }
    catch(error){

      console.error(error);

      toast.error(
        "Couldn't add that event."
      );


      return null;


    }
    finally{

      setSaving(false);

    }


  }








  async function handleUpdate(
    eventId:string,
    data:UpdateTimelineEventData
  ){


    try{

      setSaving(true);


      const updated =
        await timelineService.updateEvent(
          eventId,
          data
        );


      await refreshTimeline();


      setShowForm(false);

      setEditingEvent(null);


      toast.success(
        "Timeline event updated."
      );


      return updated;


    }
    catch(error){

      console.error(error);

      toast.error(
        "Couldn't save changes."
      );


      return null;

    }
    finally{

      setSaving(false);

    }


  }








  function handleDelete(id:string){

    setEventPendingDelete(id);

  }







  function cancelDelete(){

    if(isDeleting)
      return;


    setEventPendingDelete(null);

  }







  async function confirmDelete(){

    if(!eventPendingDelete)
      return;


    try{

      setIsDeleting(true);


      await timelineService.deleteEvent(
        eventPendingDelete
      );


      await refreshTimeline();


      toast.success(
        "Timeline event deleted."
      );


    }
    catch(error){

      console.error(error);


      toast.error(
        "Couldn't delete event."
      );

    }
    finally{

      setIsDeleting(false);

      setEventPendingDelete(null);

    }


  }







  function handleEdit(
    event:TimelineEvent
  ){

    setEditingEvent(event);

    setShowForm(true);

  }







  function handleCancel(){

    setShowForm(false);

    setEditingEvent(null);

  }







  function handleAddNew(){

    setEditingEvent(null);

    setShowForm(true);

  }








  if(loading){

    return (

      <div
        className="
          min-h-screen

          flex

          items-center

          justify-center
        "
      >

        <div
          className="
            h-9

            w-9

            rounded-full

            border-2

            border-[#FFD700]

            border-t-transparent

            animate-spin
          "
        />

      </div>

    );

  }








  if(!userId){

    return (

      <div
        className="
          px-5

          py-12

          text-center

          text-sm

          text-slate-400
        "
      >

        Please sign in to manage your timeline.

      </div>

    );

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

          max-w-3xl

          space-y-8
        "

      >






        <button

          onClick={()=>
            router.push("/dashboard")
          }

          className="
            flex

            items-center

            gap-2

            text-sm

            font-semibold

            text-slate-400

            hover:text-[#FFD700]

            transition
          "

        >

          <ArrowLeft size={16}/>

          Back to Dashboard

        </button>








        <header

          className="
            flex

            flex-col

            gap-4

            sm:flex-row

            sm:items-center

            sm:justify-between
          "

        >


          <div>

            <h1
              className="
                text-2xl

                sm:text-3xl

                font-bold

                text-white
              "
            >

              Timeline

            </h1>


            <p
              className="
                mt-1

                text-sm

                text-slate-400
              "
            >

              Document the milestones of your journey.

            </p>


          </div>






          <button

            onClick={handleAddNew}

            disabled={saving}

            className="
              w-full

              sm:w-auto

              rounded-3xl

              border

              border-[#FFD700]/30

              bg-gradient-to-r

              from-slate-800

              to-slate-900

              px-5

              py-2.5

              text-sm

              font-medium

              text-[#FFD700]

              transition

              hover:border-[#FFD700]

              disabled:opacity-50
            "

          >

            + Add Event

          </button>



        </header>







        <TimelineList

          events={events}

          onEdit={handleEdit}

          onDelete={handleDelete}

        />







        {
          showForm && (

            <TimelineForm

              event={editingEvent}

              onClose={handleCancel}

              onCreate={handleCreate}

              onUpdate={handleUpdate}

            />

          )
        }






        <DeleteConfirmDialog

          open={
            eventPendingDelete !== null
          }

          isDeleting={
            isDeleting
          }

          onConfirm={
            confirmDelete
          }

          onCancel={
            cancelDelete
          }

        />



      </div>



    </main>

  );

}