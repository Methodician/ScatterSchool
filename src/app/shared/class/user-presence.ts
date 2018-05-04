import * as firebase from 'firebase';

export class UserPresence {
  constructor(private connection, private lastOnline, private userKey: string) {
    this.prepareDisconnect();
  }

  prepareDisconnect() {
    // this.connection.onDisconnect().remove();
    // this.connection.set(true);
    // this.lastOnline.onDisconnect().set(firebase.database.ServerValue.TIMESTAMP);
  }

  public cancelDisconnect() {
    // this.connection.onDisconnect().cancel();
    // this.connection.remove();
    // this.lastOnline.onDisconnect().cancel();
    // this.lastOnline.set(firebase.database.ServerValue.TIMESTAMP);
  }
}
