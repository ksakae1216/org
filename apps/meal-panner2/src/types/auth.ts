export type UserRole = 'cook' | 'eater';

export interface User {
  uid: string;
  email: string;
  role: UserRole;
}

export interface AuthError {
  code: string;
  message: string;
}
