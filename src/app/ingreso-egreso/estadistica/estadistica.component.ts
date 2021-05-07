import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { IngresoEgreso } from 'src/app/models/ingreso-egreso.model';
import { AppStateWithIngreso } from '../ingreso-egreso.reducer';

import { ChartType } from 'chart.js';
import { MultiDataSet, Label } from 'ng2-charts';

@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.component.html',
  styles: [
  ]
})
export class EstadisticaComponent implements OnInit {

  ingresos: number = 0;
  egresos: number = 0;

  TotalIngresos: number = 0;
  TotalEgresos: number = 0;

  public doughnutChartLabels: Label[] = ['Ingresos', 'Egresos'];
  public doughnutChartData: MultiDataSet = [[]];
  public doughnutChartType: ChartType = 'doughnut';

  constructor(private store: Store<AppStateWithIngreso>) {}

  ngOnInit(): void {
    this.store.select('ingresoEgreso').subscribe(({ items }) => {
      this.generarEstadistica(items);
    });

  }

  generarEstadistica(items: IngresoEgreso[]): void {
    for (const item of items) {
      if (item.tipo === 'ingreso') {
        this.TotalIngresos += item.monto;
        this.ingresos++;
      } else {
        this.TotalEgresos += item.monto;
        this.egresos++;
      }

    }

    this.doughnutChartData = [[this.TotalIngresos, this.TotalEgresos]]

  }

}
