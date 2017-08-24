import { Component, Input } from '@angular/core';
import { SuggestionService } from './../services/suggestion/suggestion.service'
import { FirebaseListObservable } from 'angularfire2/database';
import { Router } from '@angular/router';
import { Vote } from "app/services/suggestion/vote";

@Component({
  selector: 'app-suggestion-preview',
  templateUrl: './suggestion-preview.component.html',
  styleUrls: ['./suggestion-preview.component.scss'],
  providers: [ SuggestionService ]
})

export class SuggestionPreviewComponent {
  @Input() suggestion;
  @Input() currentUserKey;
  
  constructor(private service: SuggestionService){}

}