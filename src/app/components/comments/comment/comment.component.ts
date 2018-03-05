import { AuthService } from 'app/shared/services/auth/auth.service';
import { UserService } from 'app/shared/services/user/user.service';
import { CommentService } from 'app/shared/services/comment/comment.service';
import { Router } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';
import { UserInfoOpen } from 'app/shared/class/user-info';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {
  @Input() comment;
  @Input() currentUserInfo;

  replies;
  displayName = '';
  editShowing = false;
  repliesShowing = false;

  constructor(
    private router: Router,
    private commentSvc: CommentService,
    private userSvc: UserService,
    private authSvc: AuthService
  ) { }

  ngOnInit() {
    this.commentSvc
      .getCommentsByParentKey(this.comment.$key)
      .subscribe(replies => {
        this.replies = replies;
      });

    this.userSvc
      .getUserInfo(this.comment.authorKey)
      .subscribe(userInfo => {
        if (userInfo && userInfo.uid) {
          this.displayName = userInfo.alias || userInfo.fName;
        }
      });
  }

  navigateToProfile() {
    this.router.navigate([`profile`, this.comment.authorKey]);
  }

  currentUserDisplayName() {
    return this.currentUserInfo.alias || this.currentUserInfo.fName;
  }

  isLoggedInUserComment() {
    return this.currentUserInfo && this.currentUserInfo.uid === this.comment.authorKey
  }

  toggleReplies() {
    this.repliesShowing = !this.repliesShowing;
  }

  hasReplies() {
    return this.replies && this.replies.length > 0;
  }

  isRepliesShowing() {
    return this.hasReplies() && !this.repliesShowing;
  }

  tryShowAddReply(addReply) {
    this.authSvc
      .isLoggedInCheck()
      .subscribe(isLoggedIn => {
        if (isLoggedIn) {
          addReply.toggleReplyForm();
        }
      });
  }

  toggleEdit() {
    this.editShowing = !this.editShowing;
  }

  deleteComment() {
    this.commentSvc.deleteComment(this.comment);
  }
}
