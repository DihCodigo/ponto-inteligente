import { Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';
import { UserDashboardComponent } from './pages/user/dashboard/dashboard.component';
import { AdminDashboardComponent } from './pages/admin/dashboard/dashboard.component';

import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },

  {
    path: 'user/dashboard',
    component: UserDashboardComponent,
    canActivate: [authGuard, roleGuard('USER')],
  },

  {
    path: 'admin/dashboard',
    component: AdminDashboardComponent,
    canActivate: [authGuard, roleGuard('ADMIN')],
  },

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },

  {
    path: '**',
    redirectTo: 'login',
  },
  {
    path: 'banco-horas',
    loadComponent: () =>
    import('./pages/banco-horas/banco-horas.component')
      .then(m => m.BancoHorasComponent)
}

];
