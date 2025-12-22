import { Injectable } from '@angular/core';

export type UserRole = 'USER' | 'ADMIN';

export interface AuthUser {
  email: string;
  role: UserRole;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private STORAGE_KEY = 'ponto_user';

  login(email: string, password: string): boolean {
  if (
    (email === 'admin@empresa.com' && password !== 'admin') ||
    (email === 'user@empresa.com' && password !== '1234')
  ) {
    return false;
  }

  const role: UserRole = email.includes('admin') ? 'ADMIN' : 'USER';

  localStorage.setItem(
    'ponto_user',
    JSON.stringify({ email, role })
  );

  return true;
}

  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  isLogged(): boolean {
    return !!localStorage.getItem(this.STORAGE_KEY);
  }

  getUser(): AuthUser | null {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  }

  getRole(): UserRole | null {
    return this.getUser()?.role ?? null;
  }
}
