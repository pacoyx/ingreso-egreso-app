import { Component, OnDestroy, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as ingresosEgresosActions from '../ingreso-egreso/ingreso-egreso.actions';

import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent implements OnInit, OnDestroy {

  userSubs: Subscription;
  ingresosSubs: Subscription;

  constructor(private store: Store<AppState>, private ieServices: IngresoEgresoService) { }

  ngOnInit(): void {

    this.userSubs = this.store.select('user')
      .pipe(
        filter(auth => auth.user != null)
      )
      .subscribe(({ user }) => {
        console.log(user);
        this.ingresosSubs = this.ieServices.initIngresosEgresosListener(user.uid)
          .subscribe(
            ingresosEgresosFB => {
              console.log(ingresosEgresosFB);
              this.store.dispatch(ingresosEgresosActions.setItems({ items: ingresosEgresosFB }))
            }
          );
      });

  }

  ngOnDestroy(): void {

    this.ingresosSubs.unsubscribe();
    this.userSubs.unsubscribe();
  }

}
