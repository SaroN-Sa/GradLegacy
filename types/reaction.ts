// -------------------------
// Reaction Type
// -------------------------
export type ReactionType =
  | "love"
  | "congratulations"
  | "proud"
  | "amazing"
  | "inspiring";

// -------------------------
// Reaction
// -------------------------
export interface Reaction {
  // Appwrite document ID
  $id: string;

  // Wish
  wishId: string;

  // Guest Browser ID
  guestId: string;

  // Selected Reaction
  reactionType: ReactionType;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// -------------------------
// Create Reaction
// -------------------------
export interface CreateReactionData {
  wishId: string;
  guestId: string;
  reactionType: ReactionType;
}

// -------------------------
// Update Reaction
// -------------------------
export interface UpdateReactionData
  extends Partial<CreateReactionData> {}