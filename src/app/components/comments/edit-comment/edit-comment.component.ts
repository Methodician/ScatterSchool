import { Router } from '@angular/router';
import { CommentService } from 'app/shared/services/comment/comment.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-edit-comment',
  templateUrl: './edit-comment.component.html',
  styleUrls: ['./edit-comment.component.scss']
})
export class EditCommentComponent implements OnInit {
  @Input() currentUserInfo;
  @Input() initialCommentValue;
  @Output() cancelClickSender = new EventEmitter();
  @Output() deleteClickSender = new EventEmitter();
  @Output() editFormButtonClickSender = new EventEmitter();
  


  constructor(private commentSvc: CommentService, private router: Router) { }

  ngOnInit() { }

  tryUpdateComment(commentData) {
    if (this.currentUserInfo) {
      this.updateComment(commentData);
    } else {
      this.router.navigate(['login']);
    }
  }

  updateComment(newCommentData) {
    const comment = {
      text: newCommentData.text,
      key: this.initialCommentValue.$key
    }

    this.commentSvc.updateComment(comment);
  }

  editButtonsClicked(buttonName: string){
    this.editFormButtonClickSender.emit(buttonName);
  }

  cancelButtonClicked(){
    this.cancelClickSender.emit();
  }

  deleteButtonClicked(){
    this.deleteClickSender.emit();
  }
}
