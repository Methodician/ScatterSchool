import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';

@Injectable()
export class FirestoreTestingService {

  constructor(
    private afs: AngularFirestore
  ) { }

  setTest(object) {
    this.getDoc().set(object);
  }

  updateTest(object) {
    this.getDoc().update(object);
  }

  getDoc() {
    const doc: AngularFirestoreDocument<any> = this.afs.doc<any>('test/2');
    return doc;
  }

  addTest(object) {
    this.getCollection().add(object);
  }

  getCollection() {
    const collection: AngularFirestoreCollection<any> = this.afs.collection<any>('test');
    return collection;
  }


}
