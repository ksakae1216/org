export type UserRole = 'cook' | 'eater';

export interface Group {
  id: string;
  name: string;
  code: string;
  cookIds: string[];
  eaterIds: string[];
}

export interface User {
  uid: string;
  email: string;
  role: UserRole;
  groupId?: string; // 所属グループのID
  displayName?: string;
}

export interface AuthError {
  code: string;
  message: string;
}
