import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  comment = {
    userName: 'Commenter',
    userKey: 'a9af3Ed888cj0a9sfjJJHAI8',
    text: 'This is a comment.'

  }
  constructor() { }

  ngOnInit() {
  }

}
