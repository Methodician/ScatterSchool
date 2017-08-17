import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { SuggestionService } from "app/services/suggestion/suggestion.service";

@Component({
  selector: 'app-edit-suggestion',
  templateUrl: './edit-suggestion.component.html',
  styleUrls: ['./edit-suggestion.component.scss']
})
export class EditSuggestionComponent implements OnInit {
  suggestion;
  constructor(private route: ActivatedRoute, private service: SuggestionService) {}

  ngOnInit() {
    let key = this.route.snapshot.params['key'];
    this.service.getSuggestionByKey(key)
      .subscribe(object => {
        this.suggestion = object;
      });
  }

  saveSuggestion(suggestionData) {
    this.service.updateSuggestion(this.suggestion.$key, suggestionData)
  }
}
