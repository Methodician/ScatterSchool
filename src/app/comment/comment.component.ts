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

  replies;
  displayName: string = '';
  isEditShowing: boolean = false;
  isRepliesCollapsed: boolean = false;
  isReplyShowing: boolean = false;
  dateUpdated: string = '';

  constructor(private router: Router, private commentSvc: CommentService, private userSvc: UserService) { }

  ngOnInit() {
    // this.dateUpdated = new Date(this.comment.lastUpdated).toDateString();

    this.commentSvc.getCommentsByParentKey(this.comment.$key).subscribe(replies => {
      this.replies = replies;
    });

    this.userSvc.getUserInfo(this.comment.authorKey).subscribe(userInfo => {
      if (userInfo && userInfo.uid) {
        this.displayName = userInfo.alias || userInfo.fName;
      }
    });
  }

  currentUserDisplayName() {
    return this.currentUserInfo.alias || this.currentUserInfo.fName;
  }

  isLoggedInUserComment() {
    return this.currentUserInfo && this.currentUserInfo.uid === this.comment.authorKey
  }

  toggleShowEdit() {
    this.isEditShowing = !this.isEditShowing;
  }

  toggleShowReply() {
    this.isReplyShowing = !this.isReplyShowing;
  }

  toggleCollapseReplies() {
    this.isRepliesCollapsed = !this.isRepliesCollapsed;
  }

  isRepliesShowing() {
    return this.replies && this.replies.length > 0 && !this.isRepliesCollapsed;
  }

  isValidDeletedComment() {
    return this.comment.isDeleted && this.replies && this.replies.length > 0;
  }

  deleteComment() {
    this.commentSvc.deleteComment(this.comment.$key);
  }

  navigateToProfile() {
    this.router.navigate([`profile`, this.comment.authorKey]);
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
    this.toggleShowReply();
  }
}
