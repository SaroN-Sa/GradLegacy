export type MediaType = "image" | "video" | "audio";

export type MediaVisibility = "private" | "public" | "unlisted";

export type MediaSource =
  | "graduate"
  | "visitor"
  | "timeline"
  | "memorybook";

export type MediaStatus = "active" | "deleted";

export interface Media {
  $id: string;
  $createdAt: string;
  $updatedAt: string;

  userId: string;
  uploadedBy: string;

  title?: string;
  description?: string;

  type: MediaType;

  url: string;
  publicId: string;

  visibility: MediaVisibility;

  album?: string;

  featured: boolean;

  status: MediaStatus;

  source: MediaSource;
}

export interface CreateMedia {
  userId: string;
  uploadedBy: string;

  title?: string;
  description?: string;

  type: MediaType;

  url: string;
  publicId: string;

  visibility?: MediaVisibility;

  album?: string;

  featured?: boolean;

  status?: MediaStatus;

  source?: MediaSource;
}

export interface UpdateMedia {
  title?: string;
  description?: string;

  visibility?: MediaVisibility;

  album?: string;

  featured?: boolean;

  status?: MediaStatus;
}