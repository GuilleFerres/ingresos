import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, Subscription } from 'rxjs';
import { AppState } from '../../app.reducer';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit, OnDestroy {
  nombre: string | undefined = '';
  userSubs!: Subscription;

  constructor(private authService: AuthService,
              private router: Router,
              private store: Store<AppState>) { }
 

  ngOnInit(): void {
    this.userSubs = this.store.select('user')
                        .pipe(
                          filter( ({user}) => user != null )
                        )
                        .subscribe( ({ user })=> this.nombre = user?.nombre)
  }
  ngOnDestroy(): void {
    if( this.userSubs ){
      this.userSubs.unsubscribe(); 
    }
  }

  onLogout(){
    this.authService.logOut().then( () => {
      this.router.navigate(['/login']);
  });

  }

}
