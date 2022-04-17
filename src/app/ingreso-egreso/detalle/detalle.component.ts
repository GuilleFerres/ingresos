import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from '../../app.reducer';
import { IngresoEgresoService } from '../../services/ingreso-egreso.service';
import { IngresoEgreso } from '../../models/ingreso-egreso.model';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: [
  ]
})
export class DetalleComponent implements OnInit, OnDestroy {
  ingresosEgresos: IngresoEgreso[] = [];
  ingresosSubs!: Subscription;
  constructor( private store: Store<AppState>,
               private ingresoEgresoService: IngresoEgresoService ) { }
 

  ngOnInit(): void {
    this.ingresosSubs = this.store.select('ingresosEgresos')
        .subscribe( ({ items }) => this.ingresosEgresos = items );
  }
  ngOnDestroy(): void {
    if(this.ingresosSubs) {
      this.ingresosSubs.unsubscribe;
    }
  }

  borrar( uid: string | undefined ) {
    this.ingresoEgresoService.borrarIngresoEgreso( uid )
      .then( () => Swal.fire('Borrado', 'Item borrado', 'success') )
      .catch( err => Swal.fire('Error', err.message, 'error'))

  }

}
