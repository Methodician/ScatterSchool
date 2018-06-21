import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import * as firebase from 'firebase';
import { Observable, BehaviorSubject, ObservableInput, observable, of } from 'rxjs';
import { map, mergeMap, combineLatest, merge } from 'rxjs/operators';
import { AngularFireList } from 'angularfire2/database';

@Injectable()
export class ChatService {// maybe should be renamed to UserInteractionService

  // LATER => currentChatKeys: string[];
  currentChatKey$: BehaviorSubject<string> = new BehaviorSubject(null);
  currentChatKey: string;

  //  research compound behavior subjects or subscriptions!!
  userInteractionTabSelected = null;
  userInteractionWindowExpanded = false;
  userInteractionTabSelected$: BehaviorSubject<number> = new BehaviorSubject(null);
  userInteractionWindowExpanded$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  shouldUpdateSeenCount$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  unreadMessages$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private db: AngularFireDatabase,
  ) {
    this.userInteractionTabSelected$.subscribe(tabIndex => {
      if (tabIndex === 2 && this.userInteractionWindowExpanded) {
        this.shouldUpdateSeenCount$.next(true);
      } else { this.shouldUpdateSeenCount$.next(false) };
    });
    this.userInteractionWindowExpanded$.subscribe(isOpen => {
      if (isOpen && this.userInteractionTabSelected === 2) {
        this.shouldUpdateSeenCount$.next(true);
      } else { this.shouldUpdateSeenCount$.next(false) };
    });
  }

  injectListKeys(list: AngularFireList<{}>) {
    return list
      .snapshotChanges()
      .pipe(map(elements => {
        return elements.map(element => {
          return {
            $key: element.key,
            ...element.payload.val()
          };
        });
      }));
  }

  injectObjectKey(object: AngularFireObject<{}>) {
    return object
      .snapshotChanges()
      .pipe(map(element => {
        return {
          $key: element.key,
          ...element.payload.val()
        };
      }));
  }

  selectUserInteractionTab(tabIndex: number) {
    this.userInteractionTabSelected = tabIndex;
    this.userInteractionTabSelected$.next(tabIndex);
  }

  toggleUserInteractionWindow(isOpen: boolean) {
    this.userInteractionWindowExpanded = isOpen;
    this.userInteractionWindowExpanded$.next(isOpen);
  }

  updateTotalMessagesCount(totalMessages) {
    return this.db
      .object(`chatData/chats/${this.currentChatKey}`)
      .update({ totalMessagesCount: totalMessages });
  }

  updateMessagesSeenCount(userKey, totalMessages) {
    return this.db
      .object(`chatData/chats/${this.currentChatKey}/members/${userKey}`)
      .update({ messagesSeenCount: totalMessages });
  }

  getMessagesSeenCount(userKey) {
    return this.db.object(`chatData/chats/${this.currentChatKey}/members/${userKey}`);
  }

  getMessagesForCurrentChat() {
    return this.db.list(`chatData/messagesPerChat/${this.currentChatKey}`);
  }

  getMessagesByKey(chatKey) {
    return this.db.list(`chatData/messagesPerChat/${chatKey}`);
  }

  getChatByKey(chatKey) {
    return this.db.object(`chatData/chats/${chatKey}`);
  }

  getUserChatKeys(userKey) {
    return this.db.list(`chatData/chatsPerMember/${userKey}`);
  }

  getChatsByUserKey(userKey) {
    const listRef = this.db.list(`chatData/chatsPerMember/${userKey}`);
    const chatKeyList$ = this.injectListKeys(listRef);
    const chatList$ = chatKeyList$.pipe(
      map(chatKeys => {
        const refs = chatKeys.map(chatKey => {
          // console.log('key:', chatKey);
          const chatRef = this.db.object(`chatData/chats/${chatKey.$key}`);
          return this.injectObjectKey(chatRef);
        });
        return refs;
      }));

    chatList$.subscribe(list => {
      console.log('chatList$ sub:', list);
    });

    const chatCombo = combineLatest(chatList$);
    console.log('chatCombo', chatCombo);

    const mergedList$ = chatList$.pipe(
      mergeMap(res => {
        return res;
      }));
    mergedList$.subscribe(list => {
      console.log('mergedList$ sub:', list);
    })

    const mergeCombo = combineLatest(mergedList$);
    console.log('mergeCombo', mergeCombo);

    return mergedList$;

    //  ===Takes in user key===
    // getChatsByUserKey(userKey) {
    //  ===Gets a list of chat keys based on the user key===
    //   const list = this.db.list(`chatData/chatsPerMember/${userKey}`);
    //   return this.injectListKeys(list)
    //  ===Maps key list to a list of chats with their keys===
    //     .map(userChats => {
    //       return userChats.map(chat => {
    //         return this.injectObjectKey(this.db.object(`chatData/chats/${chat.$key}`))
    //       });
    //     })
    //     .flatMap(firebaseObjectObservables => {
    //       return Observable.combineLatest(firebaseObjectObservables);
    //     });
    // }
  }

  saveMessage(messageData) {
    messageData.timestamp = firebase.database.ServerValue.TIMESTAMP;
    const dbMessageRef = this.getMessagesForCurrentChat().push(messageData);
  }

  createChat(users) {
    const dbChatsRef = this.db.list('chatData/chats'),
      chatKey = dbChatsRef.push({ timestamp: firebase.database.ServerValue.TIMESTAMP }).key,
      updateObject = {},
      memberObject = {};

    for (const user of users) {
      const displayName = user.alias ? user.alias : user.fName;
      updateObject[`members/${user.$key}/name`] = displayName;
      updateObject[`members/${user.$key}/messagesSeenCount`] = 0;
      memberObject[`${user.$key}/${chatKey}`] = true;
    }

    this.db
      .object(`chatData/chats/${chatKey}`)
      .update(updateObject);
    this.db
      .object(`chatData/chatsPerMember`)
      .update(memberObject);
    this.openChat(chatKey);
  }

  openChat(chatKey: string) {
    this.currentChatKey = chatKey;
    this.currentChatKey$.next(chatKey);
  }
}
