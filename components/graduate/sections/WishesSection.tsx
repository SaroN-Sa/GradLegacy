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
    <div className="space-y-6">

      {/* Send Wish */}

      <div className="overflow-hidden rounded-3xl bg-white shadow-xl shadow-black/20">

        <div className="border-b border-gray-100 px-7 py-6">

          <div className="mb-2 flex items-center gap-2">

            <Heart
              size={17}
              className="text-[#0f172a]"
            />

            <h2 className="text-lg font-bold text-gray-900">
              Send a Graduation Wish
            </h2>

          </div>

          <p className="text-sm text-gray-500">
            Celebrate{" "}
            <span className="font-semibold">
              {graduateName}
            </span>{" "}
            by sending a heartfelt graduation
            message.
          </p>

        </div>

        <div className="p-7">

          <WishForm
            userId={userId}
          />

        </div>

      </div>

      {/* Published Wishes */}

      <div className="overflow-hidden rounded-3xl bg-white shadow-xl shadow-black/20">

        <div className="border-b border-gray-100 px-7 py-6">

          <div className="flex items-center gap-2">

            <Heart
              size={17}
              className="text-[#0f172a]"
            />

            <h2 className="text-lg font-bold text-gray-900">
              Graduation Wishes
            </h2>

          </div>

          <p className="mt-1 text-sm text-gray-500">
            Read wishes shared by family,
            friends, teachers and visitors.
          </p>

        </div>

        <div className="p-7">

          <WishList
            userId={userId}
          />

        </div>

      </div>

    </div>
  );
}