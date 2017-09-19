import { CommentService } from './../services/comment/comment.service';
import { Router } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-add-reply',
  templateUrl: './add-reply.component.html',
  styleUrls: ['./add-reply.component.scss']
})
export class AddReplyComponent implements OnInit {
  @Input() currentUserInfo;
  @Input() parentCommentKey;

  isFormShowing: boolean = false;

  constructor(private router: Router, private commentSvc: CommentService) { }

  ngOnInit() {
  }

  postReply(replyData) {
    if(this.currentUserInfo) this.saveReply(replyData);
    else this.router.navigate(['login']);
  }

  saveReply(replyData) {
    let comment = {
      authorKey: this.currentUserInfo.$key,
      parentKey: this.parentCommentKey,
      parentType: 'comment',
      text: replyData.text,
    }

    this.commentSvc.saveComment(comment);
    this.toggleReplyForm();
  }

  toggleReplyForm() {
    this.isFormShowing = !this.isFormShowing;
  }

  currentUserDisplayName() {
    return this.currentUserInfo.alias || this.currentUserInfo.fName;
  }

  get formShowing() {
    return this.isFormShowing;
  }
}
