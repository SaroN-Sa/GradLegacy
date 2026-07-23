import { Models } from "appwrite";

export type ProfileStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "draft"
  | undefined;

export interface GraduateProfile extends Models.Document {
  userId: string;

  fullName: string;

  username: string;

  bio?: string;

  university?: string;

  department?: string;

  graduationYear?: number;

  profileImage?: string;

  coverImage?: string;

  theme?: string;

  language?: string;

  website?: string;
  linkedin?: string;
  github?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;

  status?: ProfileStatus;
}

export type Profile = GraduateProfile;