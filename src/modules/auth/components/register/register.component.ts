// register.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // ודא שהנתיב נכון

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  employee = {
    name: '',
    password: '',
    address: '',
    city: '',
    phoneNumber: '',
    bankDetails: {
      bankName: '',
      branchNumber: null,
      accountNumber: ''
    }
  };
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  register() {
    this.authService.register(this.employee).subscribe(
      (res: any) => {
        // בהצלחה בהרשמה
        localStorage.setItem('token', res.token); // שמור את הטוקן
        localStorage.setItem('isAdmin', res.newEmployee.isAdmin); // שמור אם הוא מנהל
        this.router.navigate(['/login']); // עבור לדף ההתחברות
      },
      (error) => {
        // טיפול בשגיאה
        this.errorMessage = 'Registration failed. Please try again.';
        console.error('Registration error:', error);
      }
    );
  }
}
