import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { IngresoEgreso } from 'src/app/models/ingreso-egreso.model';
import { IngresoEgresoService } from 'src/app/services/ingreso-egreso.service';
import Swal from 'sweetalert2';
import { AppStateWithIngreso } from '../ingreso-egreso.reducer';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: [
  ]
})
export class DetalleComponent implements OnInit, OnDestroy {

  ingresosEgresos: IngresoEgreso[];
  ingresossubs: Subscription;

  constructor(private store: Store<AppStateWithIngreso>, private ieservices: IngresoEgresoService) { }

  ngOnInit(): void {
    this.ingresossubs = this.store.select('ingresoEgreso')
      .subscribe(
        ({ items }) => {
          this.ingresosEgresos = items;
          console.log(items);

        }
      );
  }

  ngOnDestroy(): void {
    this.ingresossubs.unsubscribe();
  }

  borrar(uid: string) {
    console.log(uid);
    this.ieservices.borrarIngresoEgreso(uid)
      .then(() => Swal.fire('Borrado', 'se elimino el item', 'success'))
      .catch(err => Swal.fire('Error', err.message, 'error'));
  }

}
