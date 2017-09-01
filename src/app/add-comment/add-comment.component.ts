import { Router } from '@angular/router';
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
  isFormShowing: boolean = false;

  currentUserInfo;
  constructor(
    private userSvc: UserService,
    private commentSvc: CommentService,
    private router: Router    
  ) {}

  ngOnInit() {
    this.userSvc.userInfo$.subscribe(userInfo => {
      this.currentUserInfo = userInfo;
    });
  }

  postComment(commentData) {
    if (this.currentUserInfo) this.saveComment(commentData);
    else this.router.navigate(['login']);
  }

  saveComment(commentData) {
    let comment = {
      authorKey: this.currentUserInfo.uid,
      parentKey: this.parentKey,
      parentType: 'article',
      text: commentData.text
    }

    this.commentSvc.saveComment(comment);
    this.toggleCommentForm()
  }

  toggleCommentForm() {
    this.isFormShowing = !this.isFormShowing
  }
}
