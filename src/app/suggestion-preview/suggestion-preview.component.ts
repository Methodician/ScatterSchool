import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-suggestion-preview',
  templateUrl: './suggestion-preview.component.html',
  styleUrls: ['./suggestion-preview.component.scss']
})
export class SuggestionPreviewComponent implements OnInit {
  @Input() suggestionData: any;
  
  constructor() { }

  ngOnInit() {
  }

}
