export interface GraduateProfile {
  $id?: string;

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
}