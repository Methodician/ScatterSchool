import { Observable } from 'rxjs/Observable';
import { ItemWithId, StringAndNumber } from './firestore-testing.service';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';

export interface Item { text: string; }
export interface ItemWithId extends Item { id: string; }

export interface StringAndNumber { text: string, amount: number }
export interface StringAndNumberWithId extends StringAndNumber { id: string }

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

  addWithIdTest(string) {
    const id = this.afs.createId();
    const item = { id, string };
    this.getCollection().add(item);
  }

  getCollection(): AngularFirestoreCollection<any> {
    return this.afs.collection<any>('test');
  }

  getItemCollection(): AngularFirestoreCollection<Item> {
    return this.afs.collection<Item>('items');
  }

  getCollectionMappedWithIds(): Observable<ItemWithId[]> {
    return this.getCollection().snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Item;
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    });
  }

  auditTrailConsoleTest() {
    this.getCollection().auditTrail().subscribe(console.log);
  }

  updateById(id: string, value: string) {
    //  Note: Here we could preceed with a slash, or not. Both will work: '/7IBpoDGJZMR3UXcS33uW' or '7IBpoDGJZMR3UXcS33uW' for the path.
    this.getCollection().doc(id).update({ this: value });
  }

  getAuditTrailMapTest(): Observable<ItemWithId[]> {
    return this.getCollection().auditTrail().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Item;
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    });
  }

  getOnlyModifiedTest(): Observable<Item[]> {
    //  Note, array can contain any combo of 'added' 'removed' and 'modified' and defaults to all three if nothing included.
    return this.getCollection().snapshotChanges(['modified']).map(item => {
      return item.map(stuff => {
        return stuff.payload.doc.data() as Item;
      });
    });
  }

  addSandN(text: string, amount: number) {
    const object = { text: text, amount: amount };
    this.getSandNCollection().add(object);
  }

  getSandNCollection(): AngularFirestoreCollection<StringAndNumber> {
    return this.afs.collection<StringAndNumber>('stringsAndNumbers');
  }

  getSandNCollectionStateChanges() {
    //  stateChanges() can contain added, removed, and modified, presumably any or all in the array.
    return this.getSandNCollection().stateChanges(['added'])
      .map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as StringAndNumber;
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      });
  }



}
