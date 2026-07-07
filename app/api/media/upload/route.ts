import { NextRequest, NextResponse } from "next/server";
import { cloudinary } from "@/lib/cloudinary";

export async function POST(request: NextRequest) {

  try {
    const formData = await request.formData();

    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded." },
        { status: 400 }
      );
    }

        const bytes = await file.arrayBuffer();

    const buffer = Buffer.from(bytes);

        const uploadResult = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "gradlegacy/media",
            resource_type: "auto",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(buffer);
    });

        return NextResponse.json({
      success: true,

      url: uploadResult.secure_url,

      publicId: uploadResult.public_id,

      type: uploadResult.resource_type,
    });

      } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Upload failed.",
      },
      {
        status: 500,
      }
    );
  }
}