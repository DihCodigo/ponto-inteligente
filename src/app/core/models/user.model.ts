export type UserRole = 'USER' | 'ADMIN';

export interface User {
  id: number;
  nome: string;
  email: string;
  password: string;
  role: UserRole;
}
