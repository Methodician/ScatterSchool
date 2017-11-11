import { Observable } from 'rxjs/Observable';
import { FirestoreTestingService, Item, ItemWithId, StringAndNumber, StringAndNumberWithId } from 'app/firestore-testing.service';
import { Component, OnInit } from '@angular/core';
import { AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';



@Component({
  selector: 'app-firestore-testing',
  templateUrl: './firestore-testing.component.html',
  styleUrls: ['./firestore-testing.component.scss']
})
export class FirestoreTestingComponent implements OnInit {
  docPath: string;
  collectionKeys: any;

  item$: Observable<any>;
  document: AngularFirestoreDocument<any>;

  itemColl$: Observable<any[]>;
  collection: AngularFirestoreCollection<any>;

  itemCollWithId$: Observable<ItemWithId[]>;
  collectionWithId: AngularFirestoreCollection<ItemWithId>;

  itemCollFromAuditTrail$: Observable<ItemWithId[]>;
  itemCollOnlyModified$: Observable<Item[]>;

  depositCollection$: AngularFirestoreCollection<StringAndNumber>;
  deposits$: Observable<StringAndNumber[]>;
  depositsStateChanges$: Observable<StringAndNumberWithId[]>;

  constructor(
    private ftSvc: FirestoreTestingService
  ) { }

  ngOnInit() {
    //const itemDoc: AngularFirestoreDocument<any> = this.afs.document<any>('test/2');
    this.document = this.ftSvc.getDocument();
    this.item$ = this.document.valueChanges();
    this.document.snapshotChanges().subscribe(snap => {
      this.docPath = snap.payload.ref.path;
    })

    this.document.set(
      {
        test: 'testing',
        thing: 'thinging'
      }
    );

    this.collection = this.ftSvc.getCollection();
    this.itemColl$ = this.collection.valueChanges();
    this.collection.snapshotChanges().subscribe(snap => {
      this.collectionKeys = snap.keys;
    });

    this.itemCollWithId$ = this.ftSvc.getCollectionMappedWithIds();

    this.deposits$ = this.ftSvc.getSandNCollection().valueChanges();
    this.depositsStateChanges$ = this.ftSvc.getSandNCollectionStateChanges();

    this.ftSvc.auditTrailConsoleTest();
    this.itemCollFromAuditTrail$ = this.ftSvc.getAuditTrailMapTest();
    this.itemCollOnlyModified$ = this.ftSvc.getOnlyModifiedTest();
  }

  update(stuff: string) {
    const stuffObj = { stuff: stuff };
    this.ftSvc.updateTest(stuffObj);
  }

  add(item: string) {
    const itemObj = { foo: item };
    this.ftSvc.addTest(itemObj);
  }

  addWithId(item: string) {
    //const itemObj = { bar: item };
    this.ftSvc.addWithIdTest(item);
  }

  addStringAndNumber(text: string, amount: number) {
    this.ftSvc.addSandN(text, amount);
  }

  updateById(id: string, value: string) {
    this.ftSvc.updateById(id, value);
  }

}
