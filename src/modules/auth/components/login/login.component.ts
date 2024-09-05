import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  credentials = { name: '', password: '' };
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    console.log('in login');
    
  }

  login() {
    this.authService.login(this.credentials).subscribe(
      (res: any) => {
        // Save token and role info to localStorage
        localStorage.setItem('token', res.token);
        localStorage.setItem('isAdmin', res.isAdmin);

        // Navigate based on user role
        if (res.isAdmin) {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/employee']);
        }
      },
      (error) => {
        // Handle error
        this.errorMessage = 'Invalid credentials. Please try again.';
        console.error('Login error:', error);
      }
    );
  }
}
