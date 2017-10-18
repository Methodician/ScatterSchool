import { Observable } from 'rxjs/Observable';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';

@Component({
  selector: 'app-firestore-testing',
  templateUrl: './firestore-testing.component.html',
  styleUrls: ['./firestore-testing.component.scss']
})
export class FirestoreTestingComponent implements OnInit {
  item$: Observable<any>;
  item: AngularFirestoreDocument<any>;
  test: any;

  collection$: Observable<any>;

  constructor(
    private afs: AngularFirestore
  ) { }

  ngOnInit() {
    //const itemDoc: AngularFirestoreDocument<any> = this.afs.doc<any>('test/2');
    const itemDoc: AngularFirestoreDocument<any> = this.getTest();
    this.test = itemDoc.snapshotChanges().subscribe(snap => {
      //debugger
      this.test = snap.payload.ref.path;
    })
    this.item$ = itemDoc.valueChanges();
    //  Must set an object not a string
    itemDoc.set(
      {
        test: 'testing',
        thing: 'thinging'
      }
    );

    const itemCol: AngularFirestoreCollection<any> = this.afs.collection<any>('test/3/foo');
    this.collection$ = itemCol.valueChanges();

    //itemCol.add({ foo: 'bar' });
  }

  update(stuff: string) {
    const stuffObj = { stuff: stuff };
    this.updateTest(stuffObj);
  }

  updateTest(info) {
    //const itemDoc: AngularFirestoreDocument<any> = this.afs.doc<any>('test/2');
    const itemDoc = this.getTest();
    itemDoc.update(info);
  }

  getTest() {
    const doc: AngularFirestoreDocument<any> = this.afs.doc<any>('test/2');
    return doc;
  }

  add(item: string) {
    const itemObj = { foo: item };
    this.addTest(itemObj);
  }

  addTest(object) {
    const collection: AngularFirestoreCollection<any> = this.afs.collection<any>('test/3/foo');
    collection.add(object);
  }

}
