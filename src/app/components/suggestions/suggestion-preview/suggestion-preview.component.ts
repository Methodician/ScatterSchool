import { Component, Input } from '@angular/core';
import { SuggestionService } from 'app/shared/services/suggestion/suggestion.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-suggestion-preview',
  templateUrl: './suggestion-preview.component.html',
  styleUrls: ['./suggestion-preview.component.scss'],
  providers: [SuggestionService]
})

export class SuggestionPreviewComponent {
  @Input() suggestion;
  @Input() currentUserKey;

  constructor(private service: SuggestionService) { }
}
