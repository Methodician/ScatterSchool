import { Observable } from 'rxjs/Observable';
import { ItemWithId, StringAndNumber } from './firestore-testing.service';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';

export interface Item { text: string; }
export interface ItemWithId extends Item { id: string; }

export interface StringAndNumber { text: string, amount: number }
export interface StringAndNumberWIthId extends StringAndNumber { id: string }

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

  addSandN(text: string, amount: number) {
    const object = { text: text, amount: amount };
    this.getSandNCollection().add(object);
  }

  getSandNCollection(): AngularFirestoreCollection<StringAndNumber> {
    return this.afs.collection<StringAndNumber>('stringsAndNumbers');
  }

}
