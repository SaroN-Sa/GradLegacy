// -------------------------
// Relationship Type
// -------------------------
export type WishRelationship =
  | "parent"
  | "friend"
  | "teacher"
  | "colleague"
  | "relative"
  | "mentor";

// -------------------------
// Wish Status
// -------------------------
export type WishStatus =
  | "pending"
  | "published"
  | "hidden";

// -------------------------
// Wish
// -------------------------
export interface Wish {
  // Appwrite document ID
  $id: string;

  // Graduate (Owner)
  userId: string;

  // Visitor Information
  visitorName: string;
  visitorEmail?: string;

  // Visitor Relationship
  relationship: WishRelationship;

  // Wish Message
  message: string;

  // Anonymous Wish
  isAnonymous: boolean;

  // Optional Media
  imageUrl?: string;
  videoUrl?: string;

  // Dashboard Controls
  status: WishStatus;
  isFeatured: boolean;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// -------------------------
// Create Wish
// -------------------------
export interface CreateWishData {
  visitorName: string;
  visitorEmail?: string;
  relationship: WishRelationship;
  message: string;
  isAnonymous: boolean;
  imageUrl?: string;
  videoUrl?: string;
  status: WishStatus;
  isFeatured?: boolean;
}

// -------------------------
// Update Wish
// -------------------------
export interface UpdateWishData
  extends Partial<CreateWishData> {}