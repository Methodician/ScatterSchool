import { Router } from '@angular/router';
import { CommentService } from 'app/shared/services/comment/comment.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-edit-comment',
  templateUrl: './edit-comment.component.html',
  styleUrls: ['./edit-comment.component.scss']
})
export class EditCommentComponent implements OnInit {
  @Input() currentUserInfo;
  @Input() initialCommentValue;

  constructor(private commentSvc: CommentService, private router: Router) { }

  ngOnInit() { }

  tryUpdateComment(commentData) {
    if (this.currentUserInfo) this.updateComment(commentData);
    else this.router.navigate(['login']);
  }

  updateComment(newCommentData) {
    let comment = {
      text: newCommentData.text,
      key: this.initialCommentValue.$key
    }

    this.commentSvc.updateComment(comment);
  }
}
