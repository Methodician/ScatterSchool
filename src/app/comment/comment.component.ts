import { CommentService } from 'app/services/comment/comment.service';
import { Router } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';

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

  constructor(private router: Router, private commentSvc: CommentService) { }

  ngOnInit() {
    this.commentSvc.getCommentsByParentKey(this.comment.$key).subscribe(replies => {
      console.log(`replies for ${this.comment.text}:`, replies);
      this.replies = replies;
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
}
