export type ProfileFormData = {
  fullName: string;
  username: string;
  bio: string;
  university: string;
  department: string;
  graduationYear: string;
  profileImage: string;
  coverImage: string;
};

export type ProfileFormChangeEvent = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

export type ProfileFormSectionProps = {
  form: ProfileFormData;
  onChange: (e: ProfileFormChangeEvent) => void;
};