import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private objetos: AngularFirestoreCollection<any>;
  private orders: Observable<any[]>;
  private daryl :string;
  constructor(private afs: AngularFirestore) {
    this.objetos = this.afs.collection<any>('usuario');
    this.orders = this.objetos.snapshotChanges().pipe(map(
      actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return {id, ...data };
      })
    ));
   }
  public listar(): Observable<any[]> {
    return this.orders;
  }

  public buscar(id: string): Observable<any> {
    return this.objetos.doc(id).snapshotChanges();
  }

  public update(id: string, objeto: any): Promise<any> {
    return this.objetos.doc(id).update(objeto);
  }

  public delete(id: string): Promise<any> {
    return this.objetos.doc(id).delete();
  }

  public create(objeto: any): Promise<any> {
    return this.objetos.add(objeto);
  }
}
