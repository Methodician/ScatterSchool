import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';

@Injectable()
export class FirestoreTestingService {

  constructor(
    private afs: AngularFirestore
  ) { }

  setTest(object) {
    this.getDocument().set(object);
  }

  updateTest(object) {
    this.getDocument().update(object);
  }

  getDocument(): AngularFirestoreDocument<any> {
    return this.afs.doc<any>('test/2');
  }

  addTest(object) {
    this.getCollection().add(object);
  }

  getCollection(): AngularFirestoreCollection<any> {
    return this.afs.collection<any>('test');;
  }


}
