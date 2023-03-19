import { Injectable, NgZone } from '@angular/core';
import { User } from '../services/user';
import * as auth from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData: any; // Save logged in user data
  constructor(
    public afs: AngularFirestore, // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone // NgZone service to remove outside scope warning
  ) {
    
    /* Saving user data in localstorage when 
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user')!);
      } else {
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
      }
    });
    
  }

get isLoggedIn(): boolean {
  const user = JSON.parse(localStorage.getItem('user')!);
  return user !== null && user.emailVerified !== false ? true : false;
}

GoogleAuth() {
  return this.AuthLogin(new auth.GoogleAuthProvider()).then((res: any) => {
    this.router.navigate(['patient-dashboard']);
  });
}

AuthLogin(provider: any) {
  return this.afAuth
    .signInWithPopup(provider)
    .then((result) => {
      this.router.navigate(['patient-dashboard']);
      this.SetUserData(result.user);
    })
    .catch((error) => {
      window.alert(error);
    });
}

SetUserData(user: any) {
  const userRef: AngularFirestoreDocument<any> = this.afs.doc(
    `users/${user.uid}`
  );
  const userData: User = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    emailVerified: user.emailVerified,
  };
  return userRef.set(userData, {
    merge: true,
  });
}

SignOut() {
  return this.afAuth.signOut().then(() => {
    localStorage.removeItem('user');
    this.router.navigate(['home']);
  });
}
}