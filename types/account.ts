// types/account.ts

export interface AccountInfo {
  $id: string;
  name: string;
  email: string;
  emailVerification: boolean;
  status: boolean;
  registration: string;
}

export interface ChangeEmailData {
  email: string;
  password: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface SessionInfo {
  $id: string;
  provider: string;
  providerUid: string;
  current: boolean;
  ip: string;
  osName: string;
  osVersion: string;
  clientName: string;
  clientVersion: string;
  deviceName: string;
  countryName: string;
  countryCode: string;
  expire: string;
}

export interface DeleteAccountData {
  password: string;
}

export interface AccountState {
  account: AccountInfo | null;
  sessions: SessionInfo[];
  loading: boolean;
  error: string | null;
}