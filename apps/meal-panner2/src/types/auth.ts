export type UserRole = 'parent' | 'child';

export interface User {
  uid: string;
  email: string;
  role: UserRole;
}

export interface AuthError {
  code: string;
  message: string;
}
