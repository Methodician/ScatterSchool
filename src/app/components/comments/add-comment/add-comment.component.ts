import { Router } from '@angular/router';
import { CommentService } from 'app/shared/services/comment/comment.service';
import { UserService } from 'app/shared/services/user/user.service';
import { AuthService } from 'app/shared/services/auth/auth.service';
import { Component, OnInit, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-add-comment',
  templateUrl: './add-comment.component.html',
  styleUrls: ['./add-comment.component.scss']
})
export class AddCommentComponent implements OnInit {
  @Input() headerTitle;
  @Input() parentKey;
  @ViewChild('form') commentForm;
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
      .isLoggedIn()
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

  cancelComment() {
    this.isFormShowing = false;
    this.commentForm.form.reset();
  }

  toggleCommentForm() {
    this.authSvc
      .isLoggedIn()
      .subscribe(isLoggedIn => {
        if (isLoggedIn) {
          this.isFormShowing = !this.isFormShowing;
        }
      });
  }
}
