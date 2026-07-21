export type ProfileStatus = "pending" | "approved" | "rejected" | "draft" | undefined;

export interface GraduateProfile {
  $id: string;

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

// `Profile` is kept as an alias so every existing import across the app
// (profileService, dashboard/page.tsx, AdminPage, etc.) resolves to the
// exact same shape as GraduateProfile — no more mismatched types.
export type Profile = GraduateProfile;