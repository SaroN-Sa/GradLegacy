import { NextRequest, NextResponse } from "next/server";
import { cloudinary } from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const file = formData.get("file") as File | null;
    const userId = formData.get("userId") as string | null;

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: "No file uploaded.",
        },
        {
          status: 400,
        }
      );
    }

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: "User ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const mimeType = file.type;

    let resourceType: "image" | "video" | "raw" = "raw";
    let folder = `gradlegacy/graduates/${userId}/files`;

    if (mimeType.startsWith("image/")) {
      resourceType = "image";
      folder = `gradlegacy/graduates/${userId}/images`;
    } else if (mimeType.startsWith("video/")) {
      resourceType = "video";
      folder = `gradlegacy/graduates/${userId}/videos`;
    } else if (mimeType.startsWith("audio/")) {
      resourceType = "video";
      folder = `gradlegacy/graduates/${userId}/audio`;
    }

    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder,
            resource_type: resourceType,
            overwrite: false,
            unique_filename: true,
            use_filename: false,
          },
          (error, uploadResult) => {
            if (error) {
              reject(error);
            } else {
              resolve(uploadResult);
            }
          }
        )
        .end(buffer);
    });

    return NextResponse.json({
      success: true,

      media: {
        url: result.secure_url,
        publicId: result.public_id,
        type: result.resource_type,
        format: result.format,
        width: result.width ?? null,
        height: result.height ?? null,
        duration: result.duration ?? null,
        bytes: result.bytes,
        originalFilename: file.name,
      },
    });
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to upload media.",
      },
      {
        status: 500,
      }
    );
  }
}