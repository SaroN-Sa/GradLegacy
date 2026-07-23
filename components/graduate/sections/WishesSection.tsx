"use client";

import { Heart } from "lucide-react";

import WishForm from "@/components/wishes/WishForm";
import WishList from "@/components/wishes/WishList";

interface WishesSectionProps {
  userId: string;
  graduateName: string;
}

export default function WishesSection({
  userId,
  graduateName,
}: WishesSectionProps) {
  return (
    <div className="space-y-4 sm:space-y-5 md:space-y-6 w-full">

      {/* Send Wish */}

      <div className="overflow-hidden rounded-2xl sm:rounded-3xl bg-white shadow-xl shadow-black/20">

        <div className="border-b border-gray-100 px-4 sm:px-6 md:px-7 py-4 sm:py-5 md:py-6">

          <div className="mb-1.5 sm:mb-2 flex items-center gap-2">

            <Heart
              size={16}
              className="text-[#0f172a] sm:w-[17px] sm:h-[17px] shrink-0"
            />

            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              Send a Graduation Wish
            </h2>

          </div>

          <p className="text-xs sm:text-sm text-gray-500">
            Celebrate{" "}
            <span className="font-semibold">
              {graduateName}
            </span>{" "}
            by sending a heartfelt graduation
            message.
          </p>

        </div>

        <div className="p-4 sm:p-6 md:p-7">

          <WishForm
            userId={userId}
          />

        </div>

      </div>

      {/* Published Wishes */}

      <div className="overflow-hidden rounded-2xl sm:rounded-3xl bg-white shadow-xl shadow-black/20">

        <div className="border-b border-gray-100 px-4 sm:px-6 md:px-7 py-4 sm:py-5 md:py-6">

          <div className="flex items-center gap-2">

            <Heart
              size={16}
              className="text-[#0f172a] sm:w-[17px] sm:h-[17px] shrink-0"
            />

            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              Graduation Wishes
            </h2>

          </div>

          <p className="mt-1 text-xs sm:text-sm text-gray-500">
            Read wishes shared by family,
            friends, teachers and visitors.
          </p>

        </div>

        <div className="p-4 sm:p-6 md:p-7">

          <WishList
            userId={userId}
          />

        </div>

      </div>

    </div>
  );
}