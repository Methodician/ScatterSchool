import { CommentService } from './../services/comment/comment.service';
import { UserService } from './../services/user/user.service';
import { AuthService } from './../services/auth/auth.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-add-comment',
  templateUrl: './add-comment.component.html',
  styleUrls: ['./add-comment.component.scss']
})
export class AddCommentComponent implements OnInit {
  @Input() parentKey;

  currentUserInfo;
  constructor(private userSvc: UserService, private commentSvc: CommentService) { }

  ngOnInit() {
    this.userSvc.userInfo$.subscribe(userInfo => {
      this.currentUserInfo = userInfo;
    });
  }

  saveComment(commentData) {
    let comment = {
      authorKey: this.currentUserInfo.uid,
      parentKey: this.parentKey,
      text: commentData.text
    }

    this.commentSvc.saveComment(comment);
  }
}
