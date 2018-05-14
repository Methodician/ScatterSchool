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
  profileImage = '../../../../assets/images/kid-art.jpg';

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
          // console.log( "this is the user of the comment? ", userInfo);
          this.displayName = userInfo.alias || userInfo.fName;
        }
      });

    // maybe a way to refactor this?
    this.userSvc
      .getProfileImageUrl(this.comment.authorKey)
      .valueChanges()
      .subscribe( profileImageUrl => {
        if(profileImageUrl) {
          this.profileImage = profileImageUrl as string;
        }
      })

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
    // Don't think this needs the !
    // return this.hasReplies() && !this.repliesShowing;  
    return this.hasReplies() && this.repliesShowing;
  }

  tryShowAddReply(addReply) {
    this.authSvc
      .isLoggedIn()
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
    if(confirm("Are you sure you want to delete this comment?")){
    this.commentSvc.deleteComment(this.comment);
    }
  }
  
  isTopLevelComment(){
    return this.comment.parentType === 'article' ? true : false;
  }

  cancelClicked(){
    this.toggleEdit();
  }

  editFormClicked(action:string){
    if (action === 'cancel'){
      this.toggleEdit();
    }
    if (action === 'delete'){
      this.deleteComment();
    }
  }
}
