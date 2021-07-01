export enum UserRole {
  User,
  Moderator,
  Admin,
  SuperAdmin,
}

export interface AuthUser {
  _id: string;
  id: string;
  email: string;
  fullName: string;
  createdAt: Date;
}

export enum TermType {
  Quarter,
  Semester,
  Year,
}

export enum Degree {
  Bachelor,
  Master,
  Doctor,
  Diploma,
  Certificate,
}