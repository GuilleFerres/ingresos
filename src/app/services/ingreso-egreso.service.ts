import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { map } from 'rxjs/operators';

import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class IngresoEgresoService {

  constructor( private firestore: AngularFirestore,
               private authService: AuthService ) { }

  crearIngresoEgreso( ingresoEgreso: IngresoEgreso ) {

    const uid = this.authService.user?.uid; 

    delete ingresoEgreso.uid;
    
    return this.firestore.doc(`${ uid }/ingresos-egresos`)
        .collection('items')
        .add( {...ingresoEgreso} );
  }

  initIngresosEgresosListener( uid: string | undefined ) {
    return this.firestore.collection(`${ uid }/ingresos-egresos/items`)
          .snapshotChanges()
          .pipe(
            map( snapshot => snapshot.map( doc => ({ // Este map es el propio de los arrays, no de rxjs
                  uid: doc.payload.doc.id,
                  ...doc.payload.doc.data() as any
                  // Desestructuración del objeto para que los elementos del objeto se junten con el elemtno uid en un mismo objeto
                })
              )
            )
          );

  }

  borrarIngresoEgreso( uidItem: string | undefined ){
    const uid = this.authService.user?.uid; 
    return this.firestore.doc(`${ uid }/ingresos-egresos/items/${ uidItem }`).delete();
  }
}
