import { Router } from '@angular/router';
import { CommentService } from 'app/shared/services/comment/comment.service';
import { UserService } from 'app/shared/services/user/user.service';
import { AuthService } from 'app/shared/services/auth/auth.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-add-comment',
  templateUrl: './add-comment.component.html',
  styleUrls: ['./add-comment.component.scss']
})
export class AddCommentComponent implements OnInit {
  @Input() parentKey;
  isFormShowing = false;

  currentUserInfo;
  constructor(
    private userSvc: UserService,
    private authSvc: AuthService,
    private commentSvc: CommentService,
    private router: Router
  ) { }

  ngOnInit() {
    this.userSvc.userInfo$.subscribe(userInfo => {
      this.currentUserInfo = userInfo;
    });
  }

  postComment(commentData) {
    this.authSvc
      .isLoggedInCheck()
      .subscribe(isLoggedIn => {
        if (isLoggedIn) {
          this.saveComment(commentData);
        }
      });
  }

  saveComment(commentData) {
    const comment = {
      authorKey: this.currentUserInfo.uid,
      parentKey: this.parentKey,
      parentType: 'article',
      text: commentData.text
    }

    this.commentSvc.saveComment(comment);
    this.toggleCommentForm()
  }

  toggleCommentForm() {
    this.authSvc.isLoggedInCheck().subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.isFormShowing = !this.isFormShowing;
      }
    });
  }
}
