import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { first, map, switchMap, tap } from 'rxjs/operators';
import * as firebase from 'firebase/app';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {

  constructor(private afAuth: AngularFireAuth, private db: AngularFireDatabase) { 
    this.updateOnUser().subscribe();
    this.updateOnDisconnect().subscribe();
  }

  getPresence(uid: string){
    return this.db.object(`status/${uid}`).valueChanges();
  }

  getUser() {
    return this.afAuth.authState.pipe(first()).toPromise();
  }

  updateOnDisconnect() {
    return this.afAuth.authState.pipe(
      tap(user => {
        if (user) {
          this.db.object(`status/${user.uid}`).query.ref.onDisconnect().update({
            status: 'offline',
            timestamp: this.timestamp
          });
        }
      })
    );
  }

  async setPresence(status: string){
    const user = await this.getUser();
    if (user) {
      return this.db.object(`status/${user.uid}`).update({status, timestamp: this.timestamp});
    }
  }

  get timestamp(){
    return firebase.database.ServerValue.TIMESTAMP;
  }

  updateOnUser() {
    const connection = this.db.object('.info/connected').valueChanges().pipe(
      map(connected => connected ? 'online' : 'offline')
    );

    return this.afAuth.authState.pipe(
      switchMap(user => user ? connection : of('offline')),
      tap(status => this.setPresence(status))
    );
  }
}
