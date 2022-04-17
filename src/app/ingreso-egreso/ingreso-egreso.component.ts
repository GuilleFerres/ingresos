import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';

import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { AppState } from '../app.reducer';
import { Store } from '@ngrx/store';
import * as ui from '../shared/ui.actions';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: [
  ]
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {
  ingresoForm   !: FormGroup;
  tipo           : string ='ingreso';
  cargando       : boolean = false;
  loadingSubs!: Subscription;

  constructor( private fb: FormBuilder,
               private ingresoEgresoService: IngresoEgresoService,
               private store: Store<AppState>) { }

  ngOnInit(): void {
    this.ingresoForm = this.fb.group({
      descripcion: ['', Validators.required],
      monto: [ '', Validators.required ],
    });

    this.loadingSubs = this.store.select('ui')
    .subscribe( ({ isLoading }) => this.cargando = isLoading);
  }
  ngOnDestroy(): void {
    if(this.loadingSubs){
      this.loadingSubs.unsubscribe();
    }
    
  }

  guardar() {
   
    if( this.ingresoForm.invalid ){
      return;
    }
    this.store.dispatch( ui.isLoading() );
    console.log( this.ingresoForm.value);
    console.log(this.tipo);

    const { descripcion, monto }: any = this.ingresoForm.value;

    const ingresoEgreso = new IngresoEgreso( descripcion, monto, this.tipo );

    this.ingresoEgresoService.crearIngresoEgreso( ingresoEgreso )
    .then(() => {
      this.ingresoForm.reset();
      this.store.dispatch( ui.stopLoading() );
      Swal.fire('Registro creado', descripcion, 'success');
    })
    .catch( err => {
      this.store.dispatch( ui.stopLoading() );
      Swal.fire('Error', err.message, 'error');
    });
  }

}
