import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  email = '';
  password = '';
  erro = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  entrar() {
    const sucesso = this.authService.login(this.email, this.password);

    if (!sucesso) {
      this.erro = 'Email ou senha inválidos';
      return;
    }

    const role = this.authService.getRole();

    if (role === 'ADMIN') {
      this.router.navigate(['/admin/dashboard']);
    } else {
      this.router.navigate(['/user/dashboard']);
    }
  }
}
