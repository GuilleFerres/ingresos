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
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  cargando: boolean = false;
  uiSubscription!: Subscription;

  constructor( private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState> ) { }
 

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
    

    this.uiSubscription = this.store.select('ui')
        .subscribe( ui => {
          this.cargando = ui.isLoading;
          console.log('cargando subs');
        });
  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  LoginUsuario(){
    if( this.loginForm.invalid ){
      return;
    }

    this.store.dispatch(ui.isLoading());

   
    // Swal.fire({
    //   title: 'Espere, por favor',
    //   didOpen: () => {
    //     Swal.showLoading();
    //   }
    // });

    const { email, password } = this.loginForm.value;
    this.authService.loginUsuario( email, password)
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
