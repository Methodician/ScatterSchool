import { UserService } from './../services/user/user.service';
import { CommentService } from 'app/services/comment/comment.service';
import { Router } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';
import { UserInfoOpen } from "app/services/user/user-info";

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {
  @Input() comment;
  @Input() currentUserInfo;

  isFormShowing: boolean = false;
  replies;
  displayName: string = '';

  constructor(private router: Router, private commentSvc: CommentService, private userSvc: UserService) { }

  ngOnInit() {
    this.commentSvc.getCommentsByParentKey(this.comment.$key).subscribe(replies => {
      this.replies = replies;
    });

    this.userSvc.getUserInfo(this.comment.authorKey).subscribe(userInfo => {
      if (userInfo && userInfo.uid) {
        this.displayName = userInfo.alias || userInfo.fName;
      }
    });
  }

  postReply(replyData) {
    if(this.currentUserInfo) this.saveReply(replyData);
    else this.router.navigate(['login']);
  }

  saveReply(replyData) {
    let comment = {
      authorKey: this.currentUserInfo.$key,
      parentKey: this.comment.$key,
      parentType: 'comment',
      text: replyData.text,
    }

    this.commentSvc.saveComment(comment);
    this.toggleReplyForm();
  }

  toggleReplyForm() {
    this.isFormShowing = !this.isFormShowing;
  }

  navigateToProfile() {
    this.router.navigate([`profile`, this.comment.authorKey]);
  }
}
