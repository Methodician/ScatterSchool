import { UserService } from 'app/shared/services/user/user.service';
import { Component, OnInit, Input } from '@angular/core';
import { CommentService } from "app/shared/services/comment/comment.service";

@Component({
  selector: 'comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.scss']
})
export class CommentListComponent implements OnInit {
  @Input() parentKey;
  comments;
  currentUserInfo;

  constructor(
    private commentSvc: CommentService,
    private userSvc: UserService
  ) { }

  ngOnInit() {
    this.userSvc.userInfo$.subscribe(userInfo => {
      this.currentUserInfo = userInfo;
    });

    this.commentSvc.getCommentsByParentKey(this.parentKey).subscribe(comments => {
      this.comments = comments
    });
  }
}
