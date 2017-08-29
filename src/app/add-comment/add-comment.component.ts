import { UserService } from './../services/user/user.service';
import { AuthService } from './../services/auth/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-comment',
  templateUrl: './add-comment.component.html',
  styleUrls: ['./add-comment.component.scss']
})
export class AddCommentComponent implements OnInit {

  currentUserInfo;
  constructor(private userSvc: UserService) { }

  ngOnInit() {
    this.userSvc.userInfo$.subscribe(userInfo => {
      this.currentUserInfo = userInfo;
    });
  }

  saveComment(commentData) {
    let comment = {
      userKey: this.currentUserInfo.uid,
      userName: this.currentUserInfo.fName,
      text: commentData.text,
    }

    console.log(comment);
  }
}
