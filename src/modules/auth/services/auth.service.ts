// // import { Injectable } from '@angular/core';

// // @Injectable({
// //   providedIn: 'root'
// // })
// // export class AuthService {

// //   constructor() { }
// // }

// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Router } from '@angular/router';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   private loginUrl = 'http://localhost:3000/api/login';  // קישור לפונקציית הלוגין בשרת נוד
//   private isAdmin = false;  // אם המשתמש הוא מנהל או עובד

//   constructor(private http: HttpClient, private router: Router) { }

//   login(credentials: { name: string, password: string }): Observable<any> {
//     return this.http.post(this.loginUrl, credentials);
//   }

//   isLoggedIn() {
//     return !!localStorage.getItem('token');
//   }

//   checkIfAdmin() {
//     const role = localStorage.getItem('isAdmin');
//     this.isAdmin = role === 'true';
//     return this.isAdmin;
//   }

//   logout() {
//     localStorage.removeItem('token');
//     localStorage.removeItem('isAdmin');
//     this.router.navigate(['/login']);
//   }
// }


// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private registerUrl = 'http://localhost:3000/api/register';  // קישור לפונקציית הרישום בשרת נוד
  private loginUrl = 'http://localhost:3000/api/login';  // קישור לפונקציית הלוגין בשרת נוד

  private isAdmin = false;  // אם המשתמש הוא מנהל או עובד

  constructor(private http: HttpClient, private router: Router) { }

  // פונקציה לרישום משתמש
  register(employee: any): Observable<any> {
    return this.http.post(this.registerUrl, employee);
  }

  // פונקציה להתחברות
  login(credentials: { name: string, password: string }): Observable<any> {
    return this.http.post(this.loginUrl, credentials);
  }

  // פונקציה לבדוק אם המשתמש מחובר
  isLoggedIn() {
    return !!localStorage.getItem('token');
  }

  // פונקציה לבדוק אם המשתמש הוא מנהל
  checkIfAdmin() {
    const role = localStorage.getItem('isAdmin');
    this.isAdmin = role === 'true';
    return this.isAdmin;
  }

  // פונקציה להתנתקות
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    this.router.navigate(['/login']);
  }
}

