import { Component, OnInit, Input } from '@angular/core';
import { CommentService } from "app/services/comment/comment.service";

@Component({
  selector: 'comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.scss']
})
export class CommentListComponent implements OnInit {
  @Input() parentKey;
  comments;
  
  constructor(private commentSvc: CommentService) { }

  ngOnInit() {
    this.commentSvc.getAllComments().subscribe(comments => {
      this.comments = comments;
    });
  }
}
