import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';
@Injectable()
export class LogService {

  constructor(
    private afdb: AngularFireDatabase
  ) { }

  makeFbTimestamp() {
    return firebase.database.ServerValue.TIMESTAMP;
  }


  getChatCompInitKey() {
    return this.afdb.list('logData/chatComp/oninit').push({}).key;
  }

  updateChatCompInitLog(logObj: any, key: string) {
    return this.afdb.object(`logData/chatComp/onInit/${key}`).update(logObj);
  }

}
