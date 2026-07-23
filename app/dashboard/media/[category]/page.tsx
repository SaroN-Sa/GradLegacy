"use client";

import { useMemo, useState } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  RefreshCw,
  Search,
  Star,
} from "lucide-react";

import { useMediaContext } from "@/context/MediaContext";
import { getCategory } from "@/lib/media/categories";
import CategoryMotif from "@/components/media/CategoryMotif";
import MediaGrid from "@/components/media/MediaGrid";
import UploadMediaModal from "@/components/media/UploadMediaModal";
import MediaViewer from "@/components/media/MediaViewer";
import EditMediaModal from "@/components/media/EditMediaModal";
import { Media } from "@/types/media";


type TypeFilter = "all" | "image" | "video" | "audio";
type VisibilityFilter =
  | "all"
  | "public"
  | "private"
  | "unlisted";



export default function MediaCategoryPage() {

  const params = useParams<{ category: string }>();

  const category = getCategory(params.category);

  if (!category) notFound();


  const {
    userId,
    media,
    loading,
    refreshing,
    refresh,
    deleteMedia,
  } = useMediaContext();



  const [search, setSearch] = useState("");

  const [typeFilter, setTypeFilter] =
    useState<TypeFilter>("all");

  const [visibilityFilter, setVisibilityFilter] =
    useState<VisibilityFilter>("all");

  const [featuredOnly, setFeaturedOnly] =
    useState(false);


  const [uploadOpen, setUploadOpen] =
    useState(false);

  const [viewerOpen, setViewerOpen] =
    useState(false);

  const [editOpen, setEditOpen] =
    useState(false);


  const [selected, setSelected] =
    useState<Media | null>(null);



  const scoped = useMemo(
    () =>
      media.filter(category.match),
    [media, category]
  );



  const filtered = useMemo(() => {

    let list = scoped;


    if (search.trim()) {

      const kw =
        search.toLowerCase();

      list =
        list.filter(
          (m) =>
            m.title
              ?.toLowerCase()
              .includes(kw) ||
            m.description
              ?.toLowerCase()
              .includes(kw) ||
            m.album
              ?.toLowerCase()
              .includes(kw)
        );
    }



    if (
      !category.typeLocked &&
      typeFilter !== "all"
    ) {

      list =
        list.filter(
          (m) =>
            m.type === typeFilter
        );

    }



    if (
      !category.visibilityLocked &&
      visibilityFilter !== "all"
    ) {

      list =
        list.filter(
          (m) =>
            m.visibility === visibilityFilter
        );

    }



    if (
      category.slug !== "featured" &&
      featuredOnly
    ) {

      list =
        list.filter(
          (m) =>
            m.featured
        );

    }


    return list;


  }, [
    scoped,
    search,
    typeFilter,
    visibilityFilter,
    featuredOnly,
    category,
  ]);



  const Icon = category.icon;



  const handleView = (item: Media) => {

    setSelected(item);
    setViewerOpen(true);

  };



  const handleEdit = (item: Media) => {

    setSelected(item);
    setViewerOpen(false);
    setEditOpen(true);

  };



  const handleEditSaved = async () => {

    setEditOpen(false);
    setSelected(null);

    await refresh();

  };



  const handleEditDelete = async (
    item: Media
  ) => {

    await deleteMedia(item);

    setEditOpen(false);
    setSelected(null);

    await refresh();

  };




  return (

    <div
      className="
        space-y-6
        sm:space-y-7
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
          lg:items-center
          lg:justify-between
        "
      >


        <div className="min-w-0">


          <Link
            href="/dashboard/media"
            className="
              inline-flex
              items-center
              gap-2
              mb-4
              text-xs
              sm:text-sm
              font-semibold
              text-slate-400
              hover:text-[#FFD700]
              transition
            "
          >

            <ArrowLeft size={15}/>

            Back to Media Vault

          </Link>




          <div
            className="
              flex
              items-center
              gap-3
            "
          >

            <div
              className={`
                flex
                h-11
                w-11
                sm:h-12
                sm:w-12
                shrink-0
                items-center
                justify-center
                rounded-xl
                ${category.accent.bg}
                shadow-lg
              `}
            >

              <Icon
                size={20}
                className="text-white"
              />

            </div>



            <div className="min-w-0">


              <p
                className="
                  text-[10px]
                  sm:text-xs
                  font-bold
                  uppercase
                  tracking-widest
                  text-slate-500
                "
              >
                {category.eyebrow}

              </p>



              <h1
                className="
                  text-xl
                  sm:text-3xl
                  font-extrabold
                  text-white
                  truncate
                "
              >
                {category.label}

              </h1>


            </div>

          </div>



          <p
            className="
              mt-3
              text-sm
              text-slate-400
              max-w-xl
            "
          >

            {category.description}

          </p>


        </div>





        {/* ACTION BUTTONS */}

        <div
          className="
            flex
            flex-col
            xs:flex-row
            gap-3
            w-full
            sm:w-auto
          "
        >

          <button
            onClick={refresh}
            disabled={refreshing}
            className="
              flex
              justify-center
              items-center
              gap-2
              rounded-2xl
              border
              border-slate-700
              bg-slate-900
              px-4
              py-3
              text-sm
              font-semibold
              text-slate-300
              transition
              hover:border-slate-500
              disabled:opacity-50
            "
          >

            <RefreshCw
              size={16}
              className={
                refreshing
                ? "animate-spin"
                : ""
              }
            />

            Refresh

          </button>



          <button
            onClick={() =>
              setUploadOpen(true)
            }
            className="
              flex
              justify-center
              items-center
              gap-2
              rounded-2xl
              border
              border-[#FFD700]/50
              bg-slate-900
              px-5
              py-3
              text-sm
              font-bold
              text-[#FFD700]
              transition
              hover:border-[#FFD700]
            "
          >

            <Plus size={16}/>

            Upload

          </button>


        </div>


      </div>





      {/* FILTER TOOLBAR */}

      <div
        className="
          rounded-3xl
          border
          border-slate-800
          bg-gradient-to-br
          from-slate-900
          to-slate-950
          p-4
          sm:p-5
        "
      >


        <div
          className="
            flex
            flex-col
            lg:flex-row
            gap-3
          "
        >



          <div
            className="
              relative
              flex-1
            "
          >

            <Search
              size={16}
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-slate-500
              "
            />


            <input

              value={search}

              onChange={(e)=>
                setSearch(e.target.value)
              }

              placeholder={
                `Search ${category.label.toLowerCase()}...`
              }

              className="
                w-full
                rounded-2xl
                border
                border-slate-700
                bg-slate-900
                py-3
                pl-11
                pr-4
                text-sm
                text-white
                outline-none
                focus:border-[#FFD700]/60
              "
            />

          </div>





          <div
            className="
              flex
              flex-col
              sm:flex-row
              gap-3
            "
          >

            {!category.typeLocked && (

              <select
                value={typeFilter}
                onChange={(e)=>
                  setTypeFilter(
                    e.target.value as TypeFilter
                  )
                }

                className="
                  rounded-2xl
                  border
                  border-slate-700
                  bg-slate-900
                  px-4
                  py-3
                  text-sm
                  text-slate-300
                "
              >

                <option value="all">
                  All Types
                </option>

                <option value="image">
                  🖼 Images
                </option>

                <option value="video">
                  🎬 Videos
                </option>

                <option value="audio">
                  🎵 Audio
                </option>

              </select>

            )}






            <label
              className="
                flex
                items-center
                justify-center
                gap-2
                rounded-2xl
                border
                border-slate-700
                bg-slate-900
                px-4
                py-3
              "
            >

              <input
                type="checkbox"
                checked={featuredOnly}
                onChange={(e)=>
                  setFeaturedOnly(
                    e.target.checked
                  )
                }
              />


              <Star
                size={15}
                className={
                  featuredOnly
                  ? "text-[#FFD700]"
                  : "text-slate-500"
                }
              />


              Featured

            </label>


          </div>


        </div>



        <p
          className="
            mt-4
            text-xs
            text-slate-500
          "
        >

          Showing {filtered.length} of {scoped.length}

        </p>


      </div>





      {/* CONTENT */}

      {filtered.length === 0 && !loading ? (

        <div
          className="
            rounded-3xl
            border-2
            border-dashed
            border-slate-700
            py-20
          "
        >

          <div
            className="
              flex
              flex-col
              items-center
              text-center
              px-6
            "
          >

            <div
              className={`
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-2xl
                ${category.accent.soft}
              `}
            >

              <CategoryMotif
                slug={category.slug}
                className="relative"
              />

            </div>



            <h2
              className="
                mt-5
                text-xl
                font-bold
                text-white
              "
            >

              {scoped.length === 0
                ? `No ${category.label.toLowerCase()} yet`
                : "No results found"}

            </h2>


            <p
              className="
                mt-2
                max-w-xs
                text-sm
                text-slate-400
              "
            >

              Upload memories to fill this category.

            </p>


          </div>


        </div>


      ) : (

        <MediaGrid
          media={filtered}
          loading={loading}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={deleteMedia}
        />

      )}






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



      <MediaViewer
        open={viewerOpen}
        media={selected}
        onClose={()=>{
          setViewerOpen(false);
          setSelected(null);
        }}
        onEdit={handleEdit}
        onDelete={deleteMedia}
      />



      <EditMediaModal
        open={editOpen}
        media={selected}
        onClose={()=>{
          setEditOpen(false);
          setSelected(null);
        }}
        onSaved={handleEditSaved}
        onDelete={handleEditDelete}
      />


    </div>

  );
}