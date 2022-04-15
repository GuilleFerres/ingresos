import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import * as ui from '../../shared/ui.actions';


import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit, OnDestroy {
  registerForm!: FormGroup;
  cargando: boolean = false;
  uiSubscription!: Subscription;

  constructor( private fb: FormBuilder, 
               private authService: AuthService,
               private router: Router,
               private store: Store<AppState> ) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      nombre  : [ '', Validators.required ],
      correo  : [ '', [ Validators.required, Validators.email ] ],
      password: [ '', Validators.required ]
    });
    this.uiSubscription = this.store.select('ui')
                              .subscribe( ui => this.cargando = ui.isLoading);

  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  crearUsuario() {
    if( this.registerForm.invalid ){
      return;
    }
    this.store.dispatch(ui.isLoading());

    // Swal.fire({
    //   title: 'Espere, por favor',
    //   didOpen: () => {
    //     Swal.showLoading();
    //   }
    // });

    const { nombre, correo, password } = this.registerForm.value;
    this.authService.crearUsuario( nombre, correo, password)
      .then( credenciales => {
        // Swal.close();
        this.store.dispatch(ui.stopLoading());
        this.router.navigate(['/']);
        console.log( credenciales );
      }).catch( err => {
        this.store.dispatch(ui.stopLoading());
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: err.message,
          })
        });
  }

}
