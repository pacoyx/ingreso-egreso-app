import { Injectable } from '@angular/core';

// firebase
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

// Ngrx
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { Usuario } from '../models/usuario.model';
import * as authActions from '../auth/auth.actions';
import * as ingresoEgresoActions from '../ingreso-egreso/ingreso-egreso.actions';


import { map } from 'rxjs/operators';


import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userSubScription: Subscription;
  private _user: Usuario;

  get user() {
    return { ...this._user };
  }

  constructor(
    public auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private store: Store<AppState>) { }

  initAuthListener() {
    this.auth.authState.subscribe(fuser => {

      if (fuser) {
        console.log('en la fuser');

        this.userSubScription = this.firestore.doc(`${fuser.uid}/usuario`).valueChanges()
          .subscribe((firestoreUser: any) => {
            const user = Usuario.fromFirebase(firestoreUser);
            this._user = user;
            this.store.dispatch(authActions.setUser({ user }));
          });

      } else {
        console.log('saliendo del fuser');
        this._user = null;
        this.userSubScription.unsubscribe();
        this.store.dispatch(authActions.unSetUser());
        this.store.dispatch(ingresoEgresoActions.unSetItems());
      }

    });
  }

  crearUsuario(nombre: string, email: string, password: string) {
    // console.log(nombre,email, password);
    return this.auth.createUserWithEmailAndPassword(email, password)
      .then(({ user }) => {
        const newUser = new Usuario(user.uid, nombre, user.email)
        return this.firestore.doc(`${user.uid}/usuario`).set({ ...newUser });
      });

  }

  loginUsuario(email: string, password: string) {

    return this.auth.signInWithEmailAndPassword(email, password);

  }

  logout() {
    return this.auth.signOut();
  }

  isAuth() {
    return this.auth.authState.pipe(map(fuser => fuser != null));
  }
}
