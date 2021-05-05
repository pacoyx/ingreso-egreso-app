import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { AppState } from '../app.reducer';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import * as uiActions from '../shared/ui.actions';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: [
  ]
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {
  ingresoForm: FormGroup;
  tipo: string = 'ingreso';
  cargando: boolean = false;
  uiSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private ingresoEgresoservice: IngresoEgresoService,
    private store: Store<AppState>) { }


  ngOnInit(): void {

    this.ingresoForm = this.fb.group({
      descripcion: ['', Validators.required],
      monto: ['', Validators.required],
    });

    this.uiSubscription = this.store.select('ui').subscribe(ui => {
      this.cargando = ui.isLoading;
    });

  }


  ngOnDestroy() {
    this.uiSubscription.unsubscribe();
  }

  guardar() {

    if (this.ingresoForm.invalid) { return; }

    this.store.dispatch(uiActions.isLoading());

    const { descripcion, monto } = this.ingresoForm.value;
    const ingresoEgreso = new IngresoEgreso(descripcion, monto, this.tipo);
    this.ingresoEgresoservice.crearIngresoEgreso(ingresoEgreso)
      .then(() => {
        this.store.dispatch(uiActions.stopLoading());
        Swal.fire('Registro creado', descripcion, 'success');
      })
      .catch(err => {
        Swal.fire('Error', err.message, 'error');
        this.store.dispatch(uiActions.stopLoading());
      })
  }

}
