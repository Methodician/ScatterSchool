import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';

@Injectable()
export class FirestoreTestingService {

  constructor(
    private afs: AngularFirestore
  ) { }

  setTest(info) {
    //this.getTest().
  }

  getTest() {
    const doc: AngularFirestoreDocument<any> = this.afs.doc('test');
  }


}
