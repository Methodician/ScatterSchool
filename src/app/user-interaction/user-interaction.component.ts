import { Component, OnInit } from '@angular/core';
import { UserService } from 'app/services/user/user.service';
import { ChatService } from 'app/services/chat/chat.service';

@Component({
  selector: 'user-interaction',
  templateUrl: './user-interaction.component.html',
  styleUrls: ['./user-interaction.component.scss']
})
export class UserInteractionComponent implements OnInit {
  loggedInUser;
  chatList;
  userList;
  constructor(
    private userSvc: UserService,
    private chatSvc: ChatService
  ){}

  ngOnInit() {
    this.userSvc.userInfo$.subscribe(user => {
      this.loggedInUser = user;
      if(user) { 
        this.chatSvc.getChatsByUserKey(user.$key).subscribe(chatList => {
          this.chatList = chatList;
          console.log('chatList: ', chatList);
          
          this.userSvc.getUserList().subscribe(userList => {
            this.userList = userList;
            console.log('userList: ', userList);
          });
        });
      }
    });
  }

  openChat(chatKey){
    this.chatSvc.openChat(chatKey);
    // this.chatNav.selectedIndex = 2;
  }

  getMemberNames(chat) {
    return (<any>Object).values(chat.members).map(member => member.name).join(', ');
  }

}
